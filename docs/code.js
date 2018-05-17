const PIXI = require('pixi.js')
const FPS = require('yy-fps')

const Pixelate = require('../src/pixelate')

let _renderer, _fps, g

function test()
{
    const pixelate = _renderer.stage.addChild(new Pixelate())
    pixelate.scale.set(10)

    pixelate
        .lineStyle(0xff0000, 0.5)
        .moveTo(5, 5)
        .lineTo(30, 15)

    pixelate
        .line(5, 20, 30, 22, 0x00ff00, 0.5)

    pixelate
        .circle(50, 12, 5, 0, 0.5)
        .circleFill(70, 15, 6, 0x00ffff, 0.5)
        .circle(70, 15, 6, 0, 0.25)
        .points([70, 15, 70 + Math.cos(0) * 6, 15 + Math.sin(0) * 6], 0xff0000, 1)

    pixelate
        .rect(5, 35, 10, 10, 0x0000ff, 0.5)
        .point(5, 35, 0xff0000)
        .point(15, 45, 0xff0000)

    pixelate
        .rectFill(20, 35, 10, 10, 0x0000ff, 0.5)
        .line(20, 35, 30, 45)

    pixelate
        .polygonFill([60, 35, 70, 42, 65, 30])
        .polygon([60, 35, 70, 42, 65, 30], 0, 0.25)

    pixelate
        .ellipse(15, 60, 10, 5, 0x888888, 0.5)
        .ellipseFill(35, 65, 5, 10, 0x88ff88, 0.5)
        .ellipse(35, 65, 5, 10, 0, 0.5)

    pixelate
        .arc(50, 60, 10, 0, 1.5, 0xff0000, 0.5)
        .point(50, 60, 0, 0.5)
}

function resize()
{
    _renderer.renderer.resize(window.innerWidth, window.innerHeight)
}

window.onload = function ()
{
    _fps = new FPS({ side: 'bottom-left' })
    _renderer = new PIXI.Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio })
    document.body.appendChild(_renderer.view)
    _renderer.view.style.position = 'fixed'
    _renderer.view.style.width = '100vw'
    _renderer.view.style.height = '100vh'
    _renderer.view.style.left = 0
    _renderer.view.style.top = 0

    test()

    window.addEventListener('resize', resize)

    PIXI.ticker.shared.add(() =>
    {
        _fps.frame()
    })
    require('./highlight')()
}