import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { HttpStatusCode } from 'axios';
import { ContactService } from 'src/contact/contact.service';
import addNinthDigitOnPhoneNumber from '../../helper/add-ninth-digit-on-phone-number';
import { WhatsAppMessageIncomingBody } from './types/whats-app-message-incoming';
import { WhatsAppSendMessage } from './types/whats-app-send-message';

@Injectable()
export class WhatsAppService {

    private readonly logger: Logger = new Logger(WhatsAppService.name);

    constructor(
        private config: ConfigService,
        private contactService: ContactService
    ) { }

    private parseNotificationTemplate(message: WhatsAppSendMessage) {
        const parameters = message?.parameters?.map(para => ({
            type: 'text',
            text: para
        }))
        return {
            messaging_product: "whatsapp",
            type: "template",
            template: {
                name: message.template,
                language: {
                    code: 'pt_br'
                },
                components: [{
                    type: 'body',
                    parameters
                }]
            },
            to: addNinthDigitOnPhoneNumber(message.to),
        }
    }

    private parseNotificationTextOnly(message: WhatsAppSendMessage) {


        if ('buttons' in message) {

            return {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: addNinthDigitOnPhoneNumber(message.to),
                type: 'interactive',
                interactive: {
                    type: 'button',
                    body: {
                        text: message.text
                    },
                    action: {
                        buttons: message.buttons.map(({ id, title }) => ({
                            type: "reply",
                            reply: {
                                id,
                                title
                            }
                        }))
                    },
                    ...(message.footer && {
                        footer: {
                            text: message.footer
                        }
                    }),
                    ...(message.header && {
                        header: {
                            type: "text",
                            text: message.header
                        }
                    }),


                }
            }
        }

        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: addNinthDigitOnPhoneNumber(message.to),
            type: "text",
            text: {
                preview_url: false,
                body: message.text
            }
        }
    }
    private parseNotification(message: WhatsAppSendMessage) {

        if (!message?.template && !message?.text) {
            throw new HttpException('Os parâmetros estão incorretos, favor verificar', HttpStatusCode.BadRequest)
        }

        if (message.template) {

            return this.parseNotificationTemplate(message)
        }
        return this.parseNotificationTextOnly(message)
    }

    public async sendMessage(message: WhatsAppSendMessage) {

        const config = {
            method: 'post',
            url: this.config.get<string>('whatsApp.url'),
            headers: {
                'Authorization': `Bearer ${this.config.get<string>('whatsApp.apiKey')}`,
                'Content-Type': 'application/json'
            },
            data: this.parseNotification(message)
        };
        try {
            await axios(config)
        } catch (error) {
            this.logger.error({
                action: 'sendMessage',
                error
            })
        }

    }

    public async answerContact(phoneNumber: string, message: string) {
        const currentPhoneNumber = addNinthDigitOnPhoneNumber(phoneNumber)
        const contact = await this.contactService.findContactByPhoneNumber(currentPhoneNumber, false)
        const sentDetails = async () => {
            const bills = await this.contactService.getBillsWithValideDueDateByPhoneNumber(currentPhoneNumber)
            if (!bills.length) {
                await this.sendMessage({
                    to: currentPhoneNumber,
                    text: 'Você não tem débitos de mensalidade na tesouraria'
                })
                return
            }
            for (const bill of bills) {
                await this.sendMessage({
                    to: currentPhoneNumber,
                    text: bill.description
                })
            }

        }
        const sentBill = async () => {
            const bills = await this.contactService.getBillsWithValideDueDateByPhoneNumber(currentPhoneNumber)

            if (!bills?.length) {
                await this.sendMessage({
                    to: currentPhoneNumber,
                    text: 'Você não tem débitos de mensalidade na tesouraria'
                })
                return
            }

            for (const bill of bills) {
                const effectiveDate = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(bill.effectiveDate)
                await this.sendMessage({
                    to: currentPhoneNumber,
                    text: `Segue o PIX da sua mensalidade de *${effectiveDate}*(mais possíveis acréscimos, atrasos e ou dependentes), no valor total de R$ ${(new Intl.NumberFormat('pt-BR').format(bill.value.toNumber()))}.`
                })
                await this.sendMessage({
                    to: currentPhoneNumber,
                    text: bill.pixQrCode,
                    buttons: [
                        {
                            id: 'detalhes',
                            title: 'Detalhes'
                        }
                    ]
                })
            }



        }
        const defaultMessage = async () => {
            await this.sendMessage({
                to: currentPhoneNumber,
                text: `Olá ${contact.name},\n\nVisando atender de forma eficiente e rápida, este sistema fornece informações aos sócios.Você pode verificar débitos de mensalidade e da cooperativa. Se precisar falar com o Tesoureiro, selecione a opção correspondente.`,
                buttons: [
                    {
                        id: 'mensalidade',
                        title: 'Mensalidade'
                    },
                    {
                        id: 'cooperativa',
                        title: 'Cooperativa'
                    },
                    {
                        id: 'tesoureiro',
                        title: 'Tesoureiro'
                    }
                ],
                footer: 'Centro Espírita Beneficente União do Vegetal',
                header: 'Atendimento da Tesouraria do NRS'
            })
        }

        const callCooperative = async () => {
            await this.sendMessage({
                to: currentPhoneNumber,
                text: 'Você não tem débitos de mensalidade na cooperativa'
            })
        }
        const callTreasurer = async () => {

            const { name } = contact
            Promise.all([
                await this.sendMessage({
                    to: currentPhoneNumber,
                    template: 'falar_tesoureiro',
                    parameters: [
                        name
                    ]
                }),
                await this.sendMessage({
                    to: this.config.get('whatsApp.treasurerPhone'),
                    template: 'mensagem_para_tesoureiro ',
                    parameters: [
                        name,
                        currentPhoneNumber
                    ]
                })
            ])
        }


        const commands = {
            'detalhes': sentDetails,
            'mensalidade': sentBill,
            'falarcomtesoureiro': callTreasurer,
            'cooperativa': callCooperative

        }

        try {
            if (contact) {
                const command = message.replaceAll(' ', '').toLowerCase()

                await commands[command]()
                return
            }
            await this.sendMessage({
                to: currentPhoneNumber,
                template: 'telefone_nao_cadastrado'
            })
        } catch (e) {
            defaultMessage()
        }

    }

    public async webhookHandleMessages(whatsAppMessageIncomingBody: WhatsAppMessageIncomingBody) {
        const { entry, object } = whatsAppMessageIncomingBody

        if (object !== 'whatsapp_business_account' || !Array.isArray(entry)) {
            return
        }
        const actions: Promise<void>[] = []

        try {
            entry?.forEach(item => {
                item.changes.forEach(change => {
                    change.value?.messages.forEach(msg => {
                        const { type, from } = msg
                        let textMsg = null
                        if (type === 'button') {
                            const { button: { text } } = msg
                            textMsg = text
                        }
                        if (type === 'text') {
                            const { text: { body } } = msg
                            textMsg = body
                        }
                        if (type === 'interactive') {
                            const { interactive: { button_reply: { id } } } = msg
                            textMsg = id

                        }
                        this.logger.verbose({
                            action: 'whatsAppMsg',
                            from,
                            textMsg

                        })
                        if (from && textMsg) {
                            this.answerContact(from, textMsg)
                        }
                    })
                })
            })

            Promise.all(actions)
        } catch (error) {
            this.logger.error({
                action: 'webhookHandleMessages',
                error
            })

        }

    }



}
