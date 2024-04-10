interface Message {
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text: {
        body: string;
    };
}

interface Contact {
    profile: {
        name: string;
    };
    wa_id: string;
}

interface Metadata {
    display_phone_number: string;
    phone_number_id: string;
}

interface Value {
    messaging_product: string;
    metadata: Metadata;
    contacts: Contact[];
    messages: Message[];
}

export interface WhatsAppMessage {
    field: string;
    value: Value;
}

export interface WhatsAppMessageIncoming {
    changes: WhatsAppMessage[]
    id: string
}

export interface WhatsAppMessageIncomingBody {
    entry: WhatsAppMessageIncoming[]
    object: string
}

