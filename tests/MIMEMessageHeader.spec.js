import {test} from 'node:test'
import assert from 'node:assert/strict'
import {Mailbox, MIMEMessageHeader} from 'mail-mime-builder'

const eol = '\r\n'

test('header fields', () => {
    const a = new MIMEMessageHeader()
    assert.equal(a.isHeaderField({}), false)
    assert.equal(a.isHeaderField({value: 1}), false)
    assert.equal(a.isHeaderField({name: 'x-header'}), true)
    assert.equal(a.isHeaderField({name: 'x-header', invalidProp: true}), false)
    assert.equal(a.isHeaderField({name: 'x-header', value: 1, dump: '', required: true, disabled: true, generator: '', custom: ''}), true)
})

test('exports heade fields as object', () => {
    const a = new MIMEMessageHeader()
    const obj = a.toObject()
    assert.equal(obj.Date, undefined)
    assert.equal(obj.Subject, undefined)
})

test('sets and reads headers', () => {
    const a = new MIMEMessageHeader()
    a.set('From', new Mailbox('test@test.com'))
    a.set('To', new Mailbox('to@test.com'))
    a.set('Cc', [new Mailbox('cc@test.com'), new Mailbox('cc2@test.com')])
    a.set('Bcc', [new Mailbox('bcc@test.com'), new Mailbox('bcc2@test.com')])
    a.set('Reply-To', [new Mailbox('reply-to@test.com')])
    a.set('Subject', 'Testing')
    a.set('Date', 'Wed, 22 Mar 2023 12:12:02 +0000')
    a.set('Message-ID', '<qjuijvi0ie@test.com>')
    a.set('X-Custom', 'true')
    a.setCustom({name: 'X-Something', value: 'thing'})
    const adump = a.dump()

    assert.ok(a.get('From') instanceof Mailbox)
    assert.equal(a.get('Subject'), 'Testing')
    assert.equal(adump,
        'Date: Wed, 22 Mar 2023 12:12:02 +0000' + eol +
        'From: <test@test.com>' + eol +
        'Reply-To: <reply-to@test.com>' + eol +
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
    assert.throws(() => a.setCustom('something'))
    assert.throws(() => a.setCustom({name: 'something'}))
    assert.throws(() => a.set('Sender', 'some'))
    assert.throws(() => a.set('From', [new Mailbox('from@test.com'), new Mailbox('from2@test.com')]))
})
