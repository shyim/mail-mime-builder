import {expect, test} from 'bun:test'
import {MIMEMessage} from '../src/MIMEMessage'
import {Mailbox} from '../src/Mailbox'
import {MIMEMessageContent} from '../src/MIMEMessageContent'

const eol = '\r\n'

const sampleImageBase64 = '/9j/4AAQSkZJRgABAgEASABIAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//AABEIAAUABQMAEQABEQECEQH/xABPAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQEBAQAAAAAAAAAAAAAFBgQDAgEBAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwAAARECEQA/AHsDDIlo1m7dWUFHmo6DMyOOzmleB0EdwlZme6ycn1npkJbZP7FgtTvTo7qaV+KtbefPb4N8Hn4A/9k='

test('sets and gets headers', () => {
    const msg = new MIMEMessage()
    msg.setSender('test@mail.com')
    expect(msg.getSender().addr).toBe('test@mail.com')

    msg.setRecipients(['to@mail.com', '"Lorem Ipsum" <to2@mail.com>'])
    expect(msg.getRecipients()).toContainEqual(new Mailbox('to@mail.com'))
    expect(msg.getRecipients()).toContainEqual(new Mailbox('"Lorem Ipsum" <to2@mail.com>'))

    msg.setCc('cc@mail.com')
    expect(msg.getRecipients({type: 'Cc'})).toContainEqual(new Mailbox('cc@mail.com', {type: 'Cc'}))

    msg.setBcc('bcc@mail.com')
    expect(msg.getRecipients({type: 'Bcc'})).toContainEqual(new Mailbox('bcc@mail.com', {type: 'Bcc'}))

    msg.setSubject('Lorem Ipsum')
    expect(msg.getSubject()).toBe('Lorem Ipsum')

    msg.setSubject('Gözel 🐬')
    expect(msg.getSubject()).toBe('Gözel 🐬')

    expect(msg.hasInlineAttachments()).toBe(false)
    msg.addAttachment({
        inline: true,
        filename: 'sample.jpg',
        contentType: 'image/jpeg',
        data: sampleImageBase64,
        headers: {'Content-ID': 'abcdef'}
    })
    expect(msg.hasInlineAttachments()).toBe(true)
})

test('generates plain text messages', () => {
    const msg = new MIMEMessage()
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('test@mail.com')
    msg.setSubject('Lorem Ipsum')
    msg.addMessage({contentType: 'text/plain', data: 'hello there'})

    expect(msg.getMessageByType('text/plain')).toBeInstanceOf(MIMEMessageContent)
    expect(msg.asRaw()).toBe('Date: Wed, 22 Mar 2023 23:36:33 +0000' + eol +
        'From: <test@mail.com>' + eol +
        'Message-ID: <oliusb0xvxc@mail.com>' + eol +
        'Subject: =?utf-8?B?TG9yZW0gSXBzdW0=?=' + eol +
        'MIME-Version: 1.0' + eol +
        'Content-Type: text/plain; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: 7bit' + eol + eol +
        'hello there'
    )
})

test('generates html messages', () => {
    const msg = new MIMEMessage()
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('test@mail.com')
    msg.setSubject('Lorem Ipsum')
    msg.addMessage({contentType: 'text/html', data: 'hello there <b>Murat</b>'})

    expect(msg.asRaw()).toBe('Date: Wed, 22 Mar 2023 23:36:33 +0000' + eol +
        'From: <test@mail.com>' + eol +
        'Message-ID: <oliusb0xvxc@mail.com>' + eol +
        'Subject: =?utf-8?B?TG9yZW0gSXBzdW0=?=' + eol +
        'MIME-Version: 1.0' + eol +
        'Content-Type: text/html; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: 7bit' + eol + eol +
        'hello there <b>Murat</b>'
    )
})

test('generates plain text and html mixed messages', () => {
    const msg = new MIMEMessage()
    msg.boundaries = {mixed: 'abcdef', alt: 'qwerty'}
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('test@mail.com')
    msg.setSubject('Lorem Ipsum')
    msg.addMessage({contentType: 'text/plain', data: 'hello there'})
    msg.addMessage({contentType: 'text/html', data: 'hello there <b>Murat</b>'})

    expect(msg.asRaw()).toBe('Date: Wed, 22 Mar 2023 23:36:33 +0000' + eol +
        'From: <test@mail.com>' + eol +
        'Message-ID: <oliusb0xvxc@mail.com>' + eol +
        'Subject: =?utf-8?B?TG9yZW0gSXBzdW0=?=' + eol +
        'MIME-Version: 1.0' + eol +
        'Content-Type: multipart/alternative; boundary=qwerty' + eol + eol +
        '--qwerty' + eol +
        'Content-Type: text/plain; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: 7bit' + eol + eol +
        'hello there' + eol + eol +
        '--qwerty' + eol +
        'Content-Type: text/html; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: 7bit' + eol + eol +
        'hello there <b>Murat</b>' + eol + eol +
        '--qwerty--'
    )
})

test('generates plain text message with an attachment', () => {
    const msg = new MIMEMessage()
    msg.boundaries = {mixed: 'abcdef', alt: 'qwerty'}
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('test@mail.com')
    msg.setSubject('Lorem Ipsum')
    msg.addMessage({contentType: 'text/plain', data: 'hello there'})
    msg.addAttachment({
        contentType: 'image/jpg',
        filename: 'sample.jpg',
        data: sampleImageBase64
    })

    expect(msg.asRaw()).toBe('Date: Wed, 22 Mar 2023 23:36:33 +0000' + eol +
        'From: <test@mail.com>' + eol +
        'Message-ID: <oliusb0xvxc@mail.com>' + eol +
        'Subject: =?utf-8?B?TG9yZW0gSXBzdW0=?=' + eol +
        'MIME-Version: 1.0' + eol +
        'Content-Type: multipart/mixed; boundary=abcdef' + eol + eol +
        '--abcdef' + eol +
        'Content-Type: text/plain; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: 7bit' + eol + eol +
        'hello there' + eol + eol +
        '--abcdef' + eol +
        'Content-Type: image/jpg; name="sample.jpg"' + eol +
        'Content-Transfer-Encoding: base64' + eol +
        'Content-Disposition: attachment; filename="sample.jpg"' + eol + eol +
        sampleImageBase64 + eol +
        '--abcdef--'
    )
})

test('generates plain text and html mixed message with an attachment', () => {
    const msg = new MIMEMessage()
    msg.boundaries = {mixed: 'abcdef', alt: 'qwerty'}
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('test@mail.com')
    msg.setSubject('Lorem Ipsum')
    msg.addMessage({contentType: 'text/plain', data: 'hello there'})
    msg.addMessage({contentType: 'text/html', data: 'hello there <b>Murat</b>'})
    msg.addAttachment({
        contentType: 'image/jpg',
        filename: 'sample.jpg',
        data: sampleImageBase64
    })

    expect(msg.asRaw()).toBe('Date: Wed, 22 Mar 2023 23:36:33 +0000' + eol +
        'From: <test@mail.com>' + eol +
        'Message-ID: <oliusb0xvxc@mail.com>' + eol +
        'Subject: =?utf-8?B?TG9yZW0gSXBzdW0=?=' + eol +
        'MIME-Version: 1.0' + eol +
        'Content-Type: multipart/mixed; boundary=abcdef' + eol + eol +
        '--abcdef' + eol +
        'Content-Type: multipart/alternative; boundary=qwerty' + eol + eol +
        '--qwerty' + eol +
        'Content-Type: text/plain; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: 7bit' + eol + eol +
        'hello there' + eol + eol +
        '--qwerty' + eol +
        'Content-Type: text/html; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: 7bit' + eol + eol +
        'hello there <b>Murat</b>' + eol + eol +
        '--qwerty--' + eol +
        '--abcdef' + eol +
        'Content-Type: image/jpg; name="sample.jpg"' + eol +
        'Content-Transfer-Encoding: base64' + eol +
        'Content-Disposition: attachment; filename="sample.jpg"' + eol + eol +
        sampleImageBase64 + eol +
        '--abcdef--'
    )
})

test('sending only an attachment, without content isn not allowed', async () => {
    const msg = new MIMEMessage()
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('test@mail.com')
    msg.setSubject('Lorem Ipsum')
    msg.addAttachment({
        contentType: 'image/jpg',
        filename: 'sample.jpg',
        data: sampleImageBase64
    })
    expect(() => msg.asRaw()).toThrow('No content added to the message.')
})