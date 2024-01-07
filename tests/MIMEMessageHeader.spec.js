import {expect, test} from 'bun:test'
import {MIMEMessageHeader} from '../src/MIMEMessageHeader'
import {Mailbox} from '../src/Mailbox'

const eol = '\r\n'

test('header fields', () => {
    const a = new MIMEMessageHeader()
    expect(a.isHeaderField({})).toBe(false)
    expect(a.isHeaderField({value: 1})).toBe(false)
    expect(a.isHeaderField({name: 'x-header'})).toBe(true)
    expect(a.isHeaderField({name: 'x-header', invalidProp: true})).toBe(false)
    expect(a.isHeaderField({name: 'x-header', value: 1, dump: '', required: true, disabled: true, generator: '', custom: ''})).toBe(true)
})

test('exports heade fields as object', () => {
    const a = new MIMEMessageHeader()
    const obj = a.toObject()
    expect(obj.Date).toBe(undefined)
    expect(obj.Subject).toBe(undefined)
})

test('sets and reads headers', () => {
    const a = new MIMEMessageHeader()
    a.set('From', new Mailbox('test@test.com'))
    a.set('To', new Mailbox('to@test.com'))
    a.set('Cc', [new Mailbox('cc@test.com'), new Mailbox('cc2@test.com')])
    a.set('Bcc', [new Mailbox('bcc@test.com'), new Mailbox('bcc2@test.com')])
    a.set('Subject', 'Testing')
    a.set('Date', 'Wed, 22 Mar 2023 12:12:02 +0000')
    a.set('Message-ID', '<qjuijvi0ie@test.com>')
    a.set('X-Custom', 'true')
    a.setCustom({name: 'X-Something', value: 'thing'})
    const adump = a.dump()

    expect(a.get('From')).toBeInstanceOf(Mailbox)
    expect(a.get('Subject')).toBe('Testing')
    expect(adump).toBe(
        'Date: Wed, 22 Mar 2023 12:12:02 +0000' + eol +
        'From: <test@test.com>' + eol +
        'To: <to@test.com>' + eol +
        'Cc: <cc@test.com>,' + eol +
        ' <cc2@test.com>' + eol +
        'Bcc: <bcc@test.com>,' + eol +
        ' <bcc2@test.com>' + eol +
        'Message-ID: <qjuijvi0ie@test.com>' + eol +
        'Subject: =?utf-8?B?VGVzdGluZw==?=' + eol +
        'MIME-Version: 1.0' + eol +
        'X-Custom: true' + eol +
        'X-Something: thing'
    )
    expect(() => a.setCustom('something')).toThrow()
    expect(() => a.setCustom({name: 'something'})).toThrow()
    expect(() => a.set('Sender', 'some')).toThrow()
    expect(() => a.set('From', [new Mailbox('from@test.com'), new Mailbox('from2@test.com')])).toThrow()
})