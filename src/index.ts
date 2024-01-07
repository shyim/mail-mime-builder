import {MIMEMessage} from './MIMEMessage.js'

export function createMimeMessage(): MIMEMessage {
    return new MIMEMessage()
}

export {MIMEMessage} from './MIMEMessage.js'
export {Mailbox} from './Mailbox.js'
export {MIMETextError} from './MIMETextError.js'
export {MIMEMessageHeader} from './MIMEMessageHeader.js'
export {MIMEMessageContent} from './MIMEMessageContent.js'