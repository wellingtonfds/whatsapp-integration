export interface ExportConfigAxios {
    method: 'post' | 'get' | 'put'
    url: string
    headers?: { [key: string]: string }
    data?: string | object
}