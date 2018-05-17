const PIXI = require('pixi.js')

/**
 * pixi-pixelate: a container to create proper pixelated graphics
 */
class Pixelate extends PIXI.Container
{
    constructor()
    {
        super()
        this.cursor = { x: 0, y: 0 }
        this.color = 0xffffff
        this._lineStyle = { color: 0xffffff, alpha: 1 }
        this.queue = []
    }

    /**
     * clear all graphics
     */
    clear()
    {
        while (this.children.length)
        {
            this.queue.push(this.children.pop())
        }
    }

    /**
     * creates or gets an old sprite
     * @param {number} color
     * @param {number} alpha
     * @private
     */
    getPoint(color, alpha)
    {
        let point
        if (this.queue.length)
        {
            point = this.addChild(this.queue.pop())
        }
        else
        {
            point = this.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        }
        point.tint = typeof color === 'undefined' ? this._lineStyle.color : color
        point.alpha = typeof alpha === 'undefined' ? this._lineStyle.alpha : alpha
        return point
    }

    /**
     * add a point using lineStyle or provided color and alpha
     * @param {number} x
     * @param {number} y
     * @param {number} [color]
     * @param {number} [alpha]
     * @returns {Pixelate}
     */
    point(x, y, color, alpha)
    {
        const point = this.getPoint(color, alpha)
        point.position.set(x, y)
        point.width = point.height = 1
        return this
    }

    /**
     * set linestyle for pixelated layer
     * TODO: add width option
     * @param {number} [color=0xffffff]
     * @param {number} [alpha=1]
     * @returns {Pixelate}
     */
    lineStyle(color, alpha)
    {
        this._lineStyle.color = typeof color !== 'undefined' ? color : 0xffffff
        this._lineStyle.alpha = typeof alpha !== 'undefined' ? alpha : 1
        return this
    }

    /**
     * move cursor to this location
     * @param {number} x
     * @param {number} y
     * @returns {Pixelate}
     */
    moveTo(x, y)
    {
        this.cursor.x = x
        this.cursor.y = y
        return this
    }

    /**
     * draw a pixelated line between two points and move cursor to the second point
     * @param {number} x0
     * @param {number} y0
     * @param {number} x1
     * @param {number} y1
     * @param {number} [color]
     * @param {number} [alpha]
     * @returns {Pixelate}
     */
    line(x0, y0, x1, y1, color, alpha)
    {
        this.drawPoints(this.getLine(x0, y0, x1, y1), color, alpha)
        return this
    }

    /**
     * draw a pixelated line between two points and move cursor to the second point
     * based on https://github.com/madbence/node-bresenham/blob/master/index.js
     * @private
     * @param {number} x0
     * @param {number} y0
     * @param {number} x1
     * @param {number} y1
     * @returns {number[]}
     */
    getLine(x0, y0, x1, y1)
    {
        const points = []
        points.push([x0, y0])
        var dx = x1 - x0;
        var dy = y1 - y0;
        var adx = Math.abs(dx);
        var ady = Math.abs(dy);
        var eps = 0;
        var sx = dx > 0 ? 1 : -1;
        var sy = dy > 0 ? 1 : -1;
        if (adx > ady)
        {
            for (var x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx)
            {
                points.push([x, y])
                eps += ady;
                if ((eps << 1) >= adx)
                {
                    y += sy;
                    eps -= adx;
                }
            }
        } else
        {
            for (var x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy)
            {
                points.push([x, y])
                eps += adx;
                if ((eps << 1) >= ady)
                {
                    x += sx;
                    eps -= ady;
                }
            }
        }
        return points
    }

    /**
     * create a unique array
     * from https://stackoverflow.com/a/9229821/1955997
     * @param {Array} a
     */
    hashUnique(a)
    {
        const seen = {}
        return a.filter((item) =>
        {
            const key = item[0] + '.' + item[1]
            return seen.hasOwnProperty(key) ? false : (seen[key] = true)
        })
    }

    /**
     * draw a set of points, removing duplicates first
     * @private
     * @param {object[]}
     */
    drawPoints(points, color, alpha)
    {
        points = this.hashUnique(points)
        for (let point of points)
        {
            this.point(point[0], point[1], color, alpha)
        }
    }

    /**
     * draw a pixelated line from the cursor position to this position
     * @param {number} x
     * @param {number} y
     * @returns {Pixelate}
     */
    lineTo(x, y)
    {
        this.drawPoints(this.getLine(this.cursor.x, this.cursor.y, x, y))
        this.cursor.x = x
        this.cursor.y = y
        return this
    }

    /**
     * draw a pixelated circle
     * from https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
     * @param {number} x0
     * @param {number} y0
     * @param {number} radius
     * @param {number} [color]
     * @param {number} [alpha]
     * @returns {Pixelate}
     */
    circle(x0, y0, radius, color, alpha)
    {
        const points = []
        let x = radius
        let y = 0
        let decisionOver2 = 1 - x   // Decision criterion divided by 2 evaluated at x=r, y=0

        while (x >= y)
        {
            points.push([x + x0, y + y0])
            points.push([y + x0, x + y0])
            points.push([-x + x0, y + y0])
            points.push([-y + x0, x + y0])
            points.push([-x + x0, -y + y0])
            points.push([-y + x0, -x + y0])
            points.push([x + x0, -y + y0])
            points.push([y + x0, -x + y0])
            y++
            if (decisionOver2 <= 0)
            {
                decisionOver2 += 2 * y + 1 // Change in decision criterion for y -> y+1
            } else
            {
                x--
                decisionOver2 += 2 * (y - x) + 1 // Change for y -> y+1, x -> x-1
            }
        }
        this.drawPoints(points, color, alpha)
        return this
    }

    rect(x, y, width, height, color, alpha)
    {
        if (width === 1)
        {
            const point = this.getPoint(color, alpha)
            point.position.set(x, y)
            point.width = 1
            point.height = height
        }
        else if (height === 1)
        {
            const point = this.getPoint(color, alpha)
            point.position.set(x, y)
            point.width = 1
            point.height = 1
        }
        else
        {
            const top = this.getPoint(color, alpha)
            top.position.set(x, y)
            top.width = width
            top.height = 1
            const bottom = this.getPoint(color, alpha)
            bottom.position.set(x, y + height - 1)
            bottom.width = width
            bottom.height = 1
            const left = this.getPoint(color, alpha)
            left.position.set(x, y + 1)
            left.width = 1
            left.height = height - 2
            const right = this.getPoint(color, alpha)
            right.position.set(x + width - 1, y + 1)
            right.width = 1
            right.height = height - 2

        }
    }

    /**
     * draw and fill rectangle
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} [color]
     * @param {number} [alpha]
     * @returns {Pixelate}
     */
    rectFill(x, y, width, height, color, alpha)
    {
        const point = this.getPoint(color, alpha)
        point.position.set(x, y)
        point.width = width + 1
        point.height = height + 1
    }

    /**
     * empties cache of old sprites
     */
    flush()
    {
        this.queue = []
    }
}

module.exports = Pixelate