const PIXI = require('pixi.js')
const Angle = require('yy-angle')

/**
 * pixi-pixelate: a container to create proper pixelated graphics
 */
class Pixelate extends PIXI.Container
{
    constructor()
    {
        super()
        this.cursor = { x: 0, y: 0 }
        this.tint = 0xffffff
        this._lineStyle = { width: 1, tint: 0xffffff, alpha: 1, direction: 'up' }
        this.cache = []
    }

    /**
     * clear all graphics
     * @returns {Pixelate}
     */
    clear()
    {
        while (this.children.length)
        {
            this.cache.push(this.children.pop())
        }
        return this
    }

    /**
     * texture to use for sprites (defaults to PIXI.Texture.WHITE)
     * @type {PIXI.Texture}
     */
    static get texture()
    {
        return Pixelate._texture
    }
    static set texture(value)
    {
        Pixelate._texture = value
    }

    /**
     * creates or gets an old sprite
     * @param {number} tint
     * @param {number} alpha
     * @private
     */
    getPoint(tint, alpha)
    {
        let point
        if (this.cache.length)
        {
            point = this.addChild(this.cache.pop())
        }
        else
        {
            point = this.addChild(new PIXI.Sprite(Pixelate.texture))
        }
        point.tint = typeof tint === 'undefined' ? this._lineStyle.tint : tint
        point.alpha = typeof alpha === 'undefined' ? this._lineStyle.alpha : alpha
        return point
    }

    /**
     * draw a list of points
     * @param {(number[]|PIXI.Point[]|PIXI.PointLike[])} points
     * @param {number} tint
     * @param {number} alpha
     */
    points(points, tint, alpha)
    {
        if (isNaN(points[0]))
        {
            for (let point of points)
            {
                this.point(point.x, point.y, tint, alpha)
            }
        }
        else
        {
            for (let i = 0; i < points.length; i += 2)
            {
                this.point(points[i], points[i + 1], tint, alpha)
            }
        }
    }

    /**
     * add a point using lineStyle or provided tint and alpha
     * @param {number} x
     * @param {number} y
     * @param {number} [tint]
     * @param {number} [alpha]
     * @returns {Pixelate}
     */
    point(x, y, tint, alpha)
    {
        const point = this.getPoint(tint, alpha)
        point.position.set(x, y)
        point.width = point.height = 1
        return this
    }

    /**
     * if lineStyle.width > 1 then use this direction to place the next line; center=alternate up and down
     * @typedef {string} LineDirection (up, center, down)
     */

    /**
     * set linestyle for pixelated layer
     * NOTE: width only works for line() for now
     * @param {number} width
     * @param {number} [tint=0xffffff]
     * @param {number} [alpha=1]
     * @param {LineDirection} [direction=up] (up, center, down)
     * @returns {Pixelate}
     */
    lineStyle(width, tint, alpha, direction)
    {
        this._lineStyle.width = width
        this._lineStyle.tint = typeof tint !== 'undefined' ? tint : 0xffffff
        this._lineStyle.alpha = typeof alpha !== 'undefined' ? alpha : 1
        this._lineStyle.direction = direction || 'up'
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
     * @param {number} [tint]
     * @param {number} [alpha]
     * @param {number} [lineWidth]
     * @param {LineDirection} [lineDirection]
     * @returns {Pixelate}
     */
    line(x0, y0, x1, y1, tint, alpha, lineWidth, lineDirection)
    {
        lineWidth = typeof lineWidth === 'undefined' ? this._lineStyle.width : lineWidth
        lineDirection = lineDirection || this._lineStyle.direction
        if (lineWidth === 1)
        {
            this.drawPoints(this.linePoints(x0, y0, x1, y1), tint, alpha)
        }
        else
        {
            const angle = Angle.angleTwoPoints(x0, y0, x1, y1) + Math.PI / 2 * (lineDirection === 'up' ? -1 : 1)
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            const points = []
            if (lineDirection === 'center')
            {
                const half = lineWidth / 2
                points.push(x0 + Math.round(cos * half), y0 + Math.round(sin * half))
                points.push(x1 + Math.round(cos * half), y1 + Math.round(sin * half))
                points.push(x1 - Math.round(cos * half), y1 - Math.round(sin * half))
                points.push(x0 - Math.round(cos * half), y0 - Math.round(sin * half))
            }
            else
            {
                points.push(x0, y0)
                points.push(x0 + Math.round(cos * lineWidth), y0 + Math.round(sin * lineWidth))
                points.push(x1 + Math.round(cos * lineWidth), y1 + Math.round(sin * lineWidth))
                points.push(x1, y1)
            }
            this.polygonFill(points, tint, alpha, 1)
        }
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
     * @param {number[]} [points]
     * @returns {number[]}
     */
    linePoints(x0, y0, x1, y1, points)
    {
        points = points || []
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
     * @private
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
    drawPoints(points, tint, alpha)
    {
        points = this.hashUnique(points)
        for (let point of points)
        {
            this.point(point[0], point[1], tint, alpha)
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
        this.drawPoints(this.linePoints(this.cursor.x, this.cursor.y, x, y))
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
     * @param {number} [tint]
     * @param {number} [alpha]
     * @returns {Pixelate}
     */
    circle(x0, y0, radius, tint, alpha)
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
        this.drawPoints(points, tint, alpha)
        return this
    }

    /**
     * draw and fill circle
     * @param {number} x center
     * @param {number} y center
     * @param {number} radius
     * @param {number} tint
     * @param {number} alpha
     */
    circleFill(x0, y0, radius, tint, alpha)
    {
        const points = []
        let x = radius
        let y = 0
        let decisionOver2 = 1 - x   // Decision criterion divided by 2 evaluated at x=r, y=0

        while (x >= y)
        {
            this.rectPoints(-x + x0, y + y0, x * 2 + 1, 1, points)
            this.rectPoints(-y + x0, x + y0, y * 2 + 1, 1, points)
            this.rectPoints(-x + x0, -y + y0, x * 2 + 1, 1, points)
            this.rectPoints(-y + x0, -x + y0, y * 2 + 1, 1, points)
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

        this.drawPoints(points, tint, alpha)
        return this
    }

    /**
     * return an array of points for a rect
     * @private
     * @param {number} x0
     * @param {number} y0
     * @param {number} width
     * @param {number} height
     * @param {number[]} [points]
     * @returns {object[]}
     */
    rectPoints(x0, y0, width, height, points)
    {
        points = points || []
        for (let y = y0; y < y0 + height; y++)
        {
            for (let x = x0; x < x0 + width; x++)
            {
                points.push([x, y])
            }
        }
        return points
    }

    /**
     * draw the outline of a rect
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} tint
     * @param {number} alpha
     * @return {Pixelate}
     */
    rect(x, y, width, height, tint, alpha)
    {
        if (width === 1)
        {
            const point = this.getPoint(tint, alpha)
            point.position.set(x, y)
            point.width = 1
            point.height = height
        }
        else if (height === 1)
        {
            const point = this.getPoint(tint, alpha)
            point.position.set(x, y)
            point.width = 1
            point.height = 1
        }
        else
        {
            const top = this.getPoint(tint, alpha)
            top.position.set(x, y)
            top.width = width + 1
            top.height = 1
            const bottom = this.getPoint(tint, alpha)
            bottom.position.set(x, y + height)
            bottom.width = width + 1
            bottom.height = 1
            const left = this.getPoint(tint, alpha)
            left.position.set(x, y + 1)
            left.width = 1
            left.height = height - 1
            const right = this.getPoint(tint, alpha)
            right.position.set(x + width, y + 1)
            right.width = 1
            right.height = height - 1
        }
        return this
    }

    /**
     * draw and fill rectangle
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} [tint]
     * @param {number} [alpha]
     * @returns {Pixelate}
     */
    rectFill(x, y, width, height, tint, alpha)
    {
        const point = this.getPoint(tint, alpha)
        point.position.set(x, y)
        point.width = width + 1
        point.height = height + 1
        return this
    }

    /**
     * draw a pixelated ellipse
     * from http://cfetch.blogspot.tw/2014/01/wap-to-draw-ellipse-using-midpoint.html
     * @param {number} xc center
     * @param {number} yc center
     * @param {number} rx - radius x-axis
     * @param {number} ry - radius y-axis
     * @param {number} tint
     * @param {number} alpha
     * @returns {Pixelate}
     */
    ellipse(xc, yc, rx, ry, tint, alpha)
    {
        const points = []
        let x = 0, y = ry
        let p = (ry * ry) - (rx * rx * ry) + ((rx * rx) / 4)
        while ((2 * x * ry * ry) < (2 * y * rx * rx))
        {
            points.push([xc + x, yc - y])
            points.push([xc - x, yc + y])
            points.push([xc + x, yc + y])
            points.push([xc - x, yc - y])

            if (p < 0)
            {
                x = x + 1
                p = p + (2 * ry * ry * x) + (ry * ry)
            }
            else
            {
                x = x + 1
                y = y - 1
                p = p + (2 * ry * ry * x + ry * ry) - (2 * rx * rx * y)
            }
        }
        p = (x + 0.5) * (x + 0.5) * ry * ry + (y - 1) * (y - 1) * rx * rx - rx * rx * ry * ry
        while (y >= 0)
        {
            points.push([xc + x, yc - y])
            points.push([xc - x, yc + y])
            points.push([xc + x, yc + y])
            points.push([xc - x, yc - y])
            if (p > 0)
            {
                y = y - 1
                p = p - (2 * rx * rx * y) + (rx * rx)
            }
            else
            {
                y = y - 1
                x = x + 1
                p = p + (2 * ry * ry * x) - (2 * rx * rx * y) - (rx * rx)
            }
        }
        this.drawPoints(points, tint, alpha)
        return this
    }

    /**
     * draw and fill ellipse
     * @param {number} xc - x-center
     * @param {number} yc - y-center
     * @param {number} rx - radius x-axis
     * @param {number} ry - radius y-axis
     * @param {number} tint
     * @returns {Pixelate}
     */
    ellipseFill(xc, yc, rx, ry, tint, alpha)
    {
        const points = []
        let x = 0, y = ry
        let p = (ry * ry) - (rx * rx * ry) + ((rx * rx) / 4)
        while ((2 * x * ry * ry) < (2 * y * rx * rx))
        {
            this.rectPoints(xc - x, yc - y, x * 2 + 1, 1, points)
            this.rectPoints(xc - x, yc + y, x * 2 + 1, 1, points)
            if (p < 0)
            {
                x = x + 1
                p = p + (2 * ry * ry * x) + (ry * ry)
            }
            else
            {
                x = x + 1
                y = y - 1
                p = p + (2 * ry * ry * x + ry * ry) - (2 * rx * rx * y)
            }
        }
        p = (x + 0.5) * (x + 0.5) * ry * ry + (y - 1) * (y - 1) * rx * rx - rx * rx * ry * ry
        while (y >= 0)
        {
            this.rectPoints(xc - x, yc - y, x * 2 + 1, 1, points)
            this.rectPoints(xc - x, yc + y, x * 2 + 1, 1, points)
            if (p > 0)
            {
                y = y - 1
                p = p - (2 * rx * rx * y) + (rx * rx)
            }
            else
            {
                y = y - 1
                x = x + 1
                p = p + (2 * ry * ry * x) - (2 * rx * rx * y) - (rx * rx)
            }
        }
        this.drawPoints(points, tint, alpha)
        return this
    }

    /**
     * draw a pixelated polygon
     * @param {number[]} vertices
     * @param {number} tint
     * @param {number} alpha
     * @returns {Pixelate}
     */
    polygon(vertices, tint, alpha)
    {
        const points = []
        for (let i = 2; i < vertices.length; i += 2)
        {
            this.linePoints(vertices[i - 2], vertices[i - 1], vertices[i], vertices[i + 1], points)
        }
        if (vertices[vertices.length - 2] !== vertices[0] || vertices[vertices.length - 1] !== vertices[1])
        {
            this.linePoints(vertices[vertices.length - 2], vertices[vertices.length - 1], vertices[0], vertices[1], points)
        }
        this.drawPoints(points, tint, alpha)
    }

    /**
     * draw and fill pixelated polygon
     * @param {number[]} vertices
     * @param {number} tint
     * @param {number} alpha
     * @returns {Pixelate}
     */
    polygonFill(vertices, tint, alpha)
    {
        function mod(n, m)
        {
            return ((n % m) + m) % m
        }

        const points = []
        const edges = [], active = []
        let minY = Infinity, maxY = 0

        for (let i = 0; i < vertices.length; i += 2)
        {
            const p1 = { x: vertices[i], y: vertices[i + 1] }
            const p2 = { x: vertices[mod(i + 2, vertices.length)], y: vertices[mod(i + 3, vertices.length)] }
            if (p1.y - p2.y !== 0)
            {
                const edge = {}
                edge.p1 = p1
                edge.p2 = p2
                if (p1.y < p2.y)
                {
                    edge.minY = p1.y
                    edge.minX = p1.x
                }
                else
                {
                    edge.minY = p2.y
                    edge.minX = p2.x
                }
                minY = (edge.minY < minY) ? edge.minY : minY
                edge.maxY = Math.max(p1.y, p2.y)
                maxY = (edge.maxY > maxY) ? edge.maxY : maxY
                if (p1.x - p2.x === 0)
                {
                    edge.slope = Infinity
                    edge.b = p1.x
                }
                else
                {
                    edge.slope = (p1.y - p2.y) / (p1.x - p2.x)
                    edge.b = p1.y - edge.slope * p1.x
                }
                edges.push(edge)
            }
        }
        edges.sort((a, b) => { return a.minY - b.minY })
        for (let y = minY; y <= maxY; y++)
        {
            for (let i = 0; i < edges.length; i++)
            {
                const edge = edges[i]
                if (edge.minY === y)
                {
                    active.push(edge)
                    edges.splice(i, 1)
                    i--
                }
            }
            for (let i = 0; i < active.length; i++)
            {
                const edge = active[i]
                if (edge.maxY < y)
                {
                    active.splice(i, 1)
                    i--
                }
                else
                {
                    if (edge.slope !== Infinity)
                    {
                        edge.x = Math.round((y - edge.b) / edge.slope)
                    }
                    else
                    {
                        edge.x = edge.b
                    }
                }
            }
            active.sort((a, b) => { return a.x - b.x === 0 ? b.maxY - a.maxY : a.x - b.x })
            let bit = true, current = 1
            for (let x = active[0].x; x <= active[active.length - 1].x; x++)
            {
                if (bit)
                {
                    points.push([x, y])
                }
                if (active[current].x === x)
                {
                    if (active[current].maxY !== y)
                    {
                        bit = !bit
                    }
                    current++
                }
            }
        }
        this.drawPoints(points, tint, alpha)
        return this
    }

    /**
     * draw arc
     * @param {number} x0 - x-start
     * @param {number} y0 - y-start
     * @param {number} radius - radius
     * @param {number} start angle (radians)
     * @param {number} end angle (radians)
     * @param {number} tint
     * @param {number} alpha
     * @returns {Pixelate}
     */
    arc(x0, y0, radius, start, end, tint, alpha)
    {
        const interval = Math.PI / radius / 4
        const points = []
        for (let i = start; i <= end; i += interval)
        {
            points.push([Math.floor(x0 + Math.cos(i) * radius), Math.floor(y0 + Math.sin(i) * radius)])
        }
        this.drawPoints(points, tint, alpha)
        return this
    }

    /**
     * empties cache of old sprites
     */
    flush()
    {
        this.cache = []
    }
}

Pixelate._texture = PIXI.Texture.WHITE

module.exports = Pixelate