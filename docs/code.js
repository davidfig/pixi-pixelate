const PIXI = require('pixi.js')
const FPS = require('yy-fps')

const Pixelate = require('../src/graphics')

let _renderer, _fps, g

function test()
{
    const pixelate = _renderer.stage.addChild(new Pixelate())
    pixelate.scale.set(10)
    pixelate.lineStyle(0xff0000, 0.5)
    pixelate.moveTo(5, 5)
    pixelate.lineTo(30, 15)

    pixelate.lineStyle(0x00ff00, 0.5)
    pixelate.moveTo(5, 20)
    pixelate.lineTo(30, 22)

    pixelate.lineStyle(0, 0.5)
    pixelate.circle(50, 12, 5)

    pixelate.rect(5, 35, 10, 10, 0x0000ff, 0.5)
    pixelate.point(5, 35, 0xff0000)
    pixelate.point(15, 45, 0xff0000)

    pixelate.rectFill(20, 35, 10, 10, 0x0000ff, 0.5)
    pixelate.line(20, 35, 30, 45)
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