import {test} from 'node:test'
import assert from 'node:assert/strict'
import {MIMEMessageContent} from 'mail-mime-builder'

const eol = '\r\n'

const sampleImageBase64 = '/9j/4AAQSkZJRgABAgEASABIAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//AABEIAAUABQMAEQABEQECEQH/xABPAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQEBAQAAAAAAAAAAAAAFBgQDAgEBAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwAAARECEQA/AHsDDIlo1m7dWUFHmo6DMyOOzmleB0EdwlZme6ycn1npkJbZP7FgtTvTo7qaV+KtbefPb4N8Hn4A/9k='

test('plain text content', () => {
    const content = new MIMEMessageContent('hello there', {'Content-Type': 'plain/text'})
    assert.equal(content.isAttachment(), false)
    assert.equal(content.getHeader('Content-Type'), 'plain/text')
    assert.equal(content.dump({mixed: 'abcdef', alt: 'ghjklm'}),
        'Content-Type: plain/text' + eol + eol +
            'hello there'
    )
})

test('base64 encoded image attachment', () => {
    const content = new MIMEMessageContent(sampleImageBase64, {
        'Content-Type': 'image/jpg; charset=UTF-8',
        'Content-Transfer-Encoding': 'base64',
        'Content-Disposition': 'attachment;filename="sample.jpg"'
    })
    assert.equal(content.isAttachment(), true)
    assert.equal(content.getHeader('Content-Type'), 'image/jpg; charset=UTF-8')
    assert.equal(content.dump(),
        'Content-Type: image/jpg; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: base64' + eol +
        'Content-Disposition: attachment;filename="sample.jpg"' + eol + eol +
        sampleImageBase64
    )
})

test('image attachment and inline attachment together', () => {
    const content = new MIMEMessageContent(sampleImageBase64, {
        'Content-Type': 'image/jpg; charset=UTF-8',
        'Content-Transfer-Encoding': 'base64',
        'Content-Disposition': 'inline;filename="sample.jpg"'
    })
    assert.equal(content.isInlineAttachment(), true)
    assert.equal(content.getHeader('Content-Type'), 'image/jpg; charset=UTF-8')
    assert.equal(content.dump(),
        'Content-Type: image/jpg; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: base64' + eol +
        'Content-Disposition: inline;filename="sample.jpg"' + eol + eol +
        sampleImageBase64
    )
})
