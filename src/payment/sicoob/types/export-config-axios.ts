export interface ExportConfigAxios {
    method: 'post' | 'get' | 'put' | 'delete' | 'patch'
    url: string
    headers?: { [key: string]: string }
    data?: string | object
}