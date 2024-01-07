import {MIMEMessageContentHeader} from './MIMEMessageHeader.js'

export class MIMEMessageContent {
    headers
    data

    constructor(data: string, headers = {}) {
        this.headers = new MIMEMessageContentHeader()
        this.data = data
        this.setHeaders(headers)
    }

    dump() {
        const eol = '\r\n'
        return this.headers.dump() + eol + eol + this.data
    }

    isAttachment(): boolean {
        const disposition = this.headers.get('Content-Disposition')
        return typeof disposition === 'string' && disposition.includes('attachment')
    }

    isInlineAttachment(): boolean {
        const disposition = this.headers.get('Content-Disposition')
        return typeof disposition === 'string' && disposition.includes('inline')
    }

    setHeader(name: string, value: any) {
        this.headers.set(name, value)
        return name
    }

    getHeader(name: string) {
        return this.headers.get(name)
    }

    setHeaders(obj: {[index: string]: string}) {
        return Object.keys(obj).map((prop) => this.setHeader(prop, obj[prop]))
    }

    getHeaders() {
        return this.headers.toObject()
    }
}