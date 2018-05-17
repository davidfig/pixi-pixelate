'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PIXI = require('pixi.js');
var Angle = require('yy-angle');

/**
 * pixi-pixelate: a container to create proper pixelated graphics
 */

var Pixelate = function (_PIXI$Container) {
    _inherits(Pixelate, _PIXI$Container);

    function Pixelate() {
        _classCallCheck(this, Pixelate);

        var _this = _possibleConstructorReturn(this, (Pixelate.__proto__ || Object.getPrototypeOf(Pixelate)).call(this));

        _this.cursor = { x: 0, y: 0 };
        _this.tint = 0xffffff;
        _this._lineStyle = { width: 1, tint: 0xffffff, alpha: 1 };
        _this.cache = [];
        return _this;
    }

    /**
     * clear all graphics
     */


    _createClass(Pixelate, [{
        key: 'clear',
        value: function clear() {
            while (this.children.length) {
                this.cache.push(this.children.pop());
            }
        }

        /**
         * texture to use for sprites (defaults to PIXI.Texture.WHITE)
         * @type {PIXI.Texture}
         */

    }, {
        key: 'getPoint',


        /**
         * creates or gets an old sprite
         * @param {number} tint
         * @param {number} alpha
         * @private
         */
        value: function getPoint(tint, alpha) {
            var point = void 0;
            if (this.cache.length) {
                point = this.addChild(this.cache.pop());
            } else {
                point = this.addChild(new PIXI.Sprite(Pixelate.texture));
            }
            point.tint = typeof tint === 'undefined' ? this._lineStyle.tint : tint;
            point.alpha = typeof alpha === 'undefined' ? this._lineStyle.alpha : alpha;
            return point;
        }

        /**
         * draw a list of points
         * @param {(number[]|PIXI.Point[]|PIXI.PointLike[])} points
         * @param {number} tint
         * @param {number} alpha
         */

    }, {
        key: 'points',
        value: function points(_points, tint, alpha) {
            if (isNaN(_points[0])) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var point = _step.value;

                        this.point(point.x, point.y, tint, alpha);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                for (var i = 0; i < _points.length; i += 2) {
                    this.point(_points[i], _points[i + 1], tint, alpha);
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

    }, {
        key: 'point',
        value: function point(x, y, tint, alpha) {
            var point = this.getPoint(tint, alpha);
            point.position.set(x, y);
            point.width = point.height = 1;
            return this;
        }

        /**
         * set linestyle for pixelated layer
         * NOTE: width only works for line() for now
         * @param {number} width
         * @param {number} [tint=0xffffff]
         * @param {number} [alpha=1]
         * @returns {Pixelate}
         */

    }, {
        key: 'lineStyle',
        value: function lineStyle(width, tint, alpha) {
            this._lineStyle.width = width;
            this._lineStyle.tint = typeof tint !== 'undefined' ? tint : 0xffffff;
            this._lineStyle.alpha = typeof alpha !== 'undefined' ? alpha : 1;
            return this;
        }

        /**
         * move cursor to this location
         * @param {number} x
         * @param {number} y
         * @returns {Pixelate}
         */

    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            this.cursor.x = x;
            this.cursor.y = y;
            return this;
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
         * @returns {Pixelate}
         */

    }, {
        key: 'line',
        value: function line(x0, y0, x1, y1, tint, alpha, lineWidth) {
            lineWidth = typeof lineWidth === 'undefined' ? this._lineStyle.width : lineWidth;
            if (lineWidth === 1) {
                this.drawPoints(this.linePoints(x0, y0, x1, y1), tint, alpha);
            } else {
                var points = this.linePoints(x0, y0, x1, y1);
                var angle = Angle.angleTwoPoints(x0, y0, x1, y1) - Math.PI / 2;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                for (var i = 0; i < lineWidth; i++) {
                    this.linePoints(Math.round(x0 + cos * i), Math.round(y0 + sin * i), Math.round(x1 + cos * i), Math.round(y1 + sin * i), points);
                }
                this.drawPoints(points, tint, alpha);
            }
            return this;
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

    }, {
        key: 'linePoints',
        value: function linePoints(x0, y0, x1, y1, points) {
            points = points || [];
            points.push([x0, y0]);
            var dx = x1 - x0;
            var dy = y1 - y0;
            var adx = Math.abs(dx);
            var ady = Math.abs(dy);
            var eps = 0;
            var sx = dx > 0 ? 1 : -1;
            var sy = dy > 0 ? 1 : -1;
            if (adx > ady) {
                for (var x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
                    points.push([x, y]);
                    eps += ady;
                    if (eps << 1 >= adx) {
                        y += sy;
                        eps -= adx;
                    }
                }
            } else {
                for (var x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
                    points.push([x, y]);
                    eps += adx;
                    if (eps << 1 >= ady) {
                        x += sx;
                        eps -= ady;
                    }
                }
            }
            return points;
        }

        /**
         * create a unique array
         * from https://stackoverflow.com/a/9229821/1955997
         * @private
         * @param {Array} a
         */

    }, {
        key: 'hashUnique',
        value: function hashUnique(a) {
            var seen = {};
            return a.filter(function (item) {
                var key = item[0] + '.' + item[1];
                return seen.hasOwnProperty(key) ? false : seen[key] = true;
            });
        }

        /**
         * draw a set of points, removing duplicates first
         * @private
         * @param {object[]}
         */

    }, {
        key: 'drawPoints',
        value: function drawPoints(points, tint, alpha) {
            points = this.hashUnique(points);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var point = _step2.value;

                    this.point(point[0], point[1], tint, alpha);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /**
         * draw a pixelated line from the cursor position to this position
         * @param {number} x
         * @param {number} y
         * @returns {Pixelate}
         */

    }, {
        key: 'lineTo',
        value: function lineTo(x, y) {
            this.drawPoints(this.linePoints(this.cursor.x, this.cursor.y, x, y));
            this.cursor.x = x;
            this.cursor.y = y;
            return this;
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

    }, {
        key: 'circle',
        value: function circle(x0, y0, radius, tint, alpha) {
            var points = [];
            var x = radius;
            var y = 0;
            var decisionOver2 = 1 - x; // Decision criterion divided by 2 evaluated at x=r, y=0

            while (x >= y) {
                points.push([x + x0, y + y0]);
                points.push([y + x0, x + y0]);
                points.push([-x + x0, y + y0]);
                points.push([-y + x0, x + y0]);
                points.push([-x + x0, -y + y0]);
                points.push([-y + x0, -x + y0]);
                points.push([x + x0, -y + y0]);
                points.push([y + x0, -x + y0]);
                y++;
                if (decisionOver2 <= 0) {
                    decisionOver2 += 2 * y + 1; // Change in decision criterion for y -> y+1
                } else {
                    x--;
                    decisionOver2 += 2 * (y - x) + 1; // Change for y -> y+1, x -> x-1
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * draw and fill circle
         * @param {number} x center
         * @param {number} y center
         * @param {number} radius
         * @param {number} tint
         * @param {number} alpha
         */

    }, {
        key: 'circleFill',
        value: function circleFill(x0, y0, radius, tint, alpha) {
            var points = [];
            var x = radius;
            var y = 0;
            var decisionOver2 = 1 - x; // Decision criterion divided by 2 evaluated at x=r, y=0

            while (x >= y) {
                this.rectPoints(-x + x0, y + y0, x * 2 + 1, 1, points);
                this.rectPoints(-y + x0, x + y0, y * 2 + 1, 1, points);
                this.rectPoints(-x + x0, -y + y0, x * 2 + 1, 1, points);
                this.rectPoints(-y + x0, -x + y0, y * 2 + 1, 1, points);
                y++;
                if (decisionOver2 <= 0) {
                    decisionOver2 += 2 * y + 1; // Change in decision criterion for y -> y+1
                } else {
                    x--;
                    decisionOver2 += 2 * (y - x) + 1; // Change for y -> y+1, x -> x-1
                }
            }

            this.drawPoints(points, tint, alpha);
            return this;
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

    }, {
        key: 'rectPoints',
        value: function rectPoints(x0, y0, width, height, points) {
            points = points || [];
            for (var y = y0; y < y0 + height; y++) {
                for (var x = x0; x < x0 + width; x++) {
                    points.push([x, y]);
                }
            }
            return points;
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

    }, {
        key: 'rect',
        value: function rect(x, y, width, height, tint, alpha) {
            if (width === 1) {
                var point = this.getPoint(tint, alpha);
                point.position.set(x, y);
                point.width = 1;
                point.height = height;
            } else if (height === 1) {
                var _point = this.getPoint(tint, alpha);
                _point.position.set(x, y);
                _point.width = 1;
                _point.height = 1;
            } else {
                var top = this.getPoint(tint, alpha);
                top.position.set(x, y);
                top.width = width + 1;
                top.height = 1;
                var bottom = this.getPoint(tint, alpha);
                bottom.position.set(x, y + height);
                bottom.width = width + 1;
                bottom.height = 1;
                var left = this.getPoint(tint, alpha);
                left.position.set(x, y + 1);
                left.width = 1;
                left.height = height - 1;
                var right = this.getPoint(tint, alpha);
                right.position.set(x + width, y + 1);
                right.width = 1;
                right.height = height - 1;
            }
            return this;
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

    }, {
        key: 'rectFill',
        value: function rectFill(x, y, width, height, tint, alpha) {
            var point = this.getPoint(tint, alpha);
            point.position.set(x, y);
            point.width = width + 1;
            point.height = height + 1;
            return this;
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

    }, {
        key: 'ellipse',
        value: function ellipse(xc, yc, rx, ry, tint, alpha) {
            var points = [];
            var x = 0,
                y = ry;
            var p = ry * ry - rx * rx * ry + rx * rx / 4;
            while (2 * x * ry * ry < 2 * y * rx * rx) {
                points.push([xc + x, yc - y]);
                points.push([xc - x, yc + y]);
                points.push([xc + x, yc + y]);
                points.push([xc - x, yc - y]);

                if (p < 0) {
                    x = x + 1;
                    p = p + 2 * ry * ry * x + ry * ry;
                } else {
                    x = x + 1;
                    y = y - 1;
                    p = p + (2 * ry * ry * x + ry * ry) - 2 * rx * rx * y;
                }
            }
            p = (x + 0.5) * (x + 0.5) * ry * ry + (y - 1) * (y - 1) * rx * rx - rx * rx * ry * ry;
            while (y >= 0) {
                points.push([xc + x, yc - y]);
                points.push([xc - x, yc + y]);
                points.push([xc + x, yc + y]);
                points.push([xc - x, yc - y]);
                if (p > 0) {
                    y = y - 1;
                    p = p - 2 * rx * rx * y + rx * rx;
                } else {
                    y = y - 1;
                    x = x + 1;
                    p = p + 2 * ry * ry * x - 2 * rx * rx * y - rx * rx;
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
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

    }, {
        key: 'ellipseFill',
        value: function ellipseFill(xc, yc, rx, ry, tint, alpha) {
            var points = [];
            var x = 0,
                y = ry;
            var p = ry * ry - rx * rx * ry + rx * rx / 4;
            while (2 * x * ry * ry < 2 * y * rx * rx) {
                this.rectPoints(xc - x, yc - y, x * 2 + 1, 1, points);
                this.rectPoints(xc - x, yc + y, x * 2 + 1, 1, points);
                if (p < 0) {
                    x = x + 1;
                    p = p + 2 * ry * ry * x + ry * ry;
                } else {
                    x = x + 1;
                    y = y - 1;
                    p = p + (2 * ry * ry * x + ry * ry) - 2 * rx * rx * y;
                }
            }
            p = (x + 0.5) * (x + 0.5) * ry * ry + (y - 1) * (y - 1) * rx * rx - rx * rx * ry * ry;
            while (y >= 0) {
                this.rectPoints(xc - x, yc - y, x * 2 + 1, 1, points);
                this.rectPoints(xc - x, yc + y, x * 2 + 1, 1, points);
                if (p > 0) {
                    y = y - 1;
                    p = p - 2 * rx * rx * y + rx * rx;
                } else {
                    y = y - 1;
                    x = x + 1;
                    p = p + 2 * ry * ry * x - 2 * rx * rx * y - rx * rx;
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * draw a pixelated polygon
         * @param {number[]} vertices
         * @param {number} tint
         * @param {number} alpha
         * @returns {Pixelate}
         */

    }, {
        key: 'polygon',
        value: function polygon(vertices, tint, alpha) {
            var points = [];
            for (var i = 2; i < vertices.length; i += 2) {
                this.linePoints(vertices[i - 2], vertices[i - 1], vertices[i], vertices[i + 1], points);
            }
            if (vertices[vertices.length - 2] !== vertices[0] || vertices[vertices.length - 1] !== vertices[1]) {
                this.linePoints(vertices[vertices.length - 2], vertices[vertices.length - 1], vertices[0], vertices[1], points);
            }
            this.drawPoints(points, tint, alpha);
        }

        /**
         * draw and fill pixelated polygon
         * @param {number[]} vertices
         * @param {number} tint
         * @param {number} alpha
         * @returns {Pixelate}
         */

    }, {
        key: 'polygonFill',
        value: function polygonFill(vertices, tint, alpha) {
            function mod(n, m) {
                return (n % m + m) % m;
            }

            var points = [];
            var edges = [],
                active = [];
            var minY = Infinity,
                maxY = 0;

            for (var i = 0; i < vertices.length; i += 2) {
                var p1 = { x: vertices[i], y: vertices[i + 1] };
                var p2 = { x: vertices[mod(i + 2, vertices.length)], y: vertices[mod(i + 3, vertices.length)] };
                if (p1.y - p2.y !== 0) {
                    var edge = {};
                    edge.p1 = p1;
                    edge.p2 = p2;
                    if (p1.y < p2.y) {
                        edge.minY = p1.y;
                        edge.minX = p1.x;
                    } else {
                        edge.minY = p2.y;
                        edge.minX = p2.x;
                    }
                    minY = edge.minY < minY ? edge.minY : minY;
                    edge.maxY = Math.max(p1.y, p2.y);
                    maxY = edge.maxY > maxY ? edge.maxY : maxY;
                    if (p1.x - p2.x === 0) {
                        edge.slope = Infinity;
                        edge.b = p1.x;
                    } else {
                        edge.slope = (p1.y - p2.y) / (p1.x - p2.x);
                        edge.b = p1.y - edge.slope * p1.x;
                    }
                    edges.push(edge);
                }
            }
            edges.sort(function (a, b) {
                return a.minY - b.minY;
            });
            for (var y = minY; y <= maxY; y++) {
                for (var _i = 0; _i < edges.length; _i++) {
                    var _edge = edges[_i];
                    if (_edge.minY === y) {
                        active.push(_edge);
                        edges.splice(_i, 1);
                        _i--;
                    }
                }
                for (var _i2 = 0; _i2 < active.length; _i2++) {
                    var _edge2 = active[_i2];
                    if (_edge2.maxY < y) {
                        active.splice(_i2, 1);
                        _i2--;
                    } else {
                        if (_edge2.slope !== Infinity) {
                            _edge2.x = Math.round((y - _edge2.b) / _edge2.slope);
                        } else {
                            _edge2.x = _edge2.b;
                        }
                    }
                }
                active.sort(function (a, b) {
                    return a.x - b.x === 0 ? b.maxY - a.maxY : a.x - b.x;
                });
                var bit = true,
                    current = 1;
                for (var x = active[0].x; x <= active[active.length - 1].x; x++) {
                    if (bit) {
                        points.push([x, y]);
                    }
                    if (active[current].x === x) {
                        if (active[current].maxY !== y) {
                            bit = !bit;
                        }
                        current++;
                    }
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
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

    }, {
        key: 'arc',
        value: function arc(x0, y0, radius, start, end, tint, alpha) {
            var interval = Math.PI / radius / 4;
            var points = [];
            for (var i = start; i <= end; i += interval) {
                points.push([Math.floor(x0 + Math.cos(i) * radius), Math.floor(y0 + Math.sin(i) * radius)]);
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * empties cache of old sprites
         */

    }, {
        key: 'flush',
        value: function flush() {
            this.cache = [];
        }
    }], [{
        key: 'texture',
        get: function get() {
            return Pixelate._texture;
        },
        set: function set(value) {
            Pixelate._texture = value;
        }
    }]);

    return Pixelate;
}(PIXI.Container);

Pixelate._texture = PIXI.Texture.WHITE;

module.exports = Pixelate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXhlbGF0ZS5qcyJdLCJuYW1lcyI6WyJQSVhJIiwicmVxdWlyZSIsIkFuZ2xlIiwiUGl4ZWxhdGUiLCJjdXJzb3IiLCJ4IiwieSIsInRpbnQiLCJfbGluZVN0eWxlIiwid2lkdGgiLCJhbHBoYSIsImNhY2hlIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJwdXNoIiwicG9wIiwicG9pbnQiLCJhZGRDaGlsZCIsIlNwcml0ZSIsInRleHR1cmUiLCJwb2ludHMiLCJpc05hTiIsImkiLCJnZXRQb2ludCIsInBvc2l0aW9uIiwic2V0IiwiaGVpZ2h0IiwieDAiLCJ5MCIsIngxIiwieTEiLCJsaW5lV2lkdGgiLCJkcmF3UG9pbnRzIiwibGluZVBvaW50cyIsImFuZ2xlIiwiYW5nbGVUd29Qb2ludHMiLCJNYXRoIiwiUEkiLCJjb3MiLCJzaW4iLCJyb3VuZCIsImR4IiwiZHkiLCJhZHgiLCJhYnMiLCJhZHkiLCJlcHMiLCJzeCIsInN5IiwiYSIsInNlZW4iLCJmaWx0ZXIiLCJpdGVtIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJoYXNoVW5pcXVlIiwicmFkaXVzIiwiZGVjaXNpb25PdmVyMiIsInJlY3RQb2ludHMiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJ4YyIsInljIiwicngiLCJyeSIsInAiLCJ2ZXJ0aWNlcyIsIm1vZCIsIm4iLCJtIiwiZWRnZXMiLCJhY3RpdmUiLCJtaW5ZIiwiSW5maW5pdHkiLCJtYXhZIiwicDEiLCJwMiIsImVkZ2UiLCJtaW5YIiwibWF4Iiwic2xvcGUiLCJiIiwic29ydCIsInNwbGljZSIsImJpdCIsImN1cnJlbnQiLCJzdGFydCIsImVuZCIsImludGVydmFsIiwiZmxvb3IiLCJfdGV4dHVyZSIsInZhbHVlIiwiQ29udGFpbmVyIiwiVGV4dHVyZSIsIldISVRFIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLE9BQU9DLFFBQVEsU0FBUixDQUFiO0FBQ0EsSUFB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LElBQUlFLElBQUlrRSxLQUFiLEVBQW9CbEUsS0FBS21FLEdBQXpCLEVBQThCbkUsS0FBS29FLFFBQW5DLEVBQ0E7QUFDSXRFLHVCQUFPTixJQUFQLENBQVksQ0FBQ3NCLEtBQUt1RCxLQUFMLENBQVdoRSxLQUFLUyxLQUFLRSxHQUFMLENBQVNoQixDQUFULElBQWNrQyxNQUE5QixDQUFELEVBQXdDcEIsS0FBS3VELEtBQUwsQ0FBVy9ELEtBQUtRLEtBQUtHLEdBQUwsQ0FBU2pCLENBQVQsSUFBY2tDLE1BQTlCLENBQXhDLENBQVo7QUFDSDtBQUNELGlCQUFLeEIsVUFBTCxDQUFnQlosTUFBaEIsRUFBd0JiLElBQXhCLEVBQThCRyxLQUE5QjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7O2dDQUlBO0FBQ0ksaUJBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0g7Ozs0QkFwcEJEO0FBQ0ksbUJBQU9SLFNBQVN5RixRQUFoQjtBQUNILFM7MEJBQ2tCQyxLLEVBQ25CO0FBQ0kxRixxQkFBU3lGLFFBQVQsR0FBb0JDLEtBQXBCO0FBQ0g7Ozs7RUFqQ2tCN0YsS0FBSzhGLFM7O0FBa3JCNUIzRixTQUFTeUYsUUFBVCxHQUFvQjVGLEtBQUsrRixPQUFMLENBQWFDLEtBQWpDOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCL0YsUUFBakIiLCJmaWxlIjoicGl4ZWxhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpXHJcbmNvbnN0IEFuZ2xlID0gcmVxdWlyZSgneXktYW5nbGUnKVxyXG5cclxuLyoqXHJcbiAqIHBpeGktcGl4ZWxhdGU6IGEgY29udGFpbmVyIHRvIGNyZWF0ZSBwcm9wZXIgcGl4ZWxhdGVkIGdyYXBoaWNzXHJcbiAqL1xyXG5jbGFzcyBQaXhlbGF0ZSBleHRlbmRzIFBJWEkuQ29udGFpbmVyXHJcbntcclxuICAgIGNvbnN0cnVjdG9yKClcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5jdXJzb3IgPSB7IHg6IDAsIHk6IDAgfVxyXG4gICAgICAgIHRoaXMudGludCA9IDB4ZmZmZmZmXHJcbiAgICAgICAgdGhpcy5fbGluZVN0eWxlID0geyB3aWR0aDogMSwgdGludDogMHhmZmZmZmYsIGFscGhhOiAxIH1cclxuICAgICAgICB0aGlzLmNhY2hlID0gW11cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNsZWFyIGFsbCBncmFwaGljc1xyXG4gICAgICovXHJcbiAgICBjbGVhcigpXHJcbiAgICB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHRoaXMuY2hpbGRyZW4ucG9wKCkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGV4dHVyZSB0byB1c2UgZm9yIHNwcml0ZXMgKGRlZmF1bHRzIHRvIFBJWEkuVGV4dHVyZS5XSElURSlcclxuICAgICAqIEB0eXBlIHtQSVhJLlRleHR1cmV9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgdGV4dHVyZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFBpeGVsYXRlLl90ZXh0dXJlXHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2V0IHRleHR1cmUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgUGl4ZWxhdGUuX3RleHR1cmUgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlcyBvciBnZXRzIGFuIG9sZCBzcHJpdGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBwb2ludFxyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlLmxlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcy5hZGRDaGlsZCh0aGlzLmNhY2hlLnBvcCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludCA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuU3ByaXRlKFBpeGVsYXRlLnRleHR1cmUpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludC50aW50ID0gdHlwZW9mIHRpbnQgPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLnRpbnQgOiB0aW50XHJcbiAgICAgICAgcG9pbnQuYWxwaGEgPSB0eXBlb2YgYWxwaGEgPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLmFscGhhIDogYWxwaGFcclxuICAgICAgICByZXR1cm4gcG9pbnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBsaXN0IG9mIHBvaW50c1xyXG4gICAgICogQHBhcmFtIHsobnVtYmVyW118UElYSS5Qb2ludFtdfFBJWEkuUG9pbnRMaWtlW10pfSBwb2ludHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqL1xyXG4gICAgcG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHBvaW50c1swXSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnQocG9pbnQueCwgcG9pbnQueSwgdGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnQocG9pbnRzW2ldLCBwb2ludHNbaSArIDFdLCB0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZCBhIHBvaW50IHVzaW5nIGxpbmVTdHlsZSBvciBwcm92aWRlZCB0aW50IGFuZCBhbHBoYVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBwb2ludCh4LCB5LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgcG9pbnQud2lkdGggPSBwb2ludC5oZWlnaHQgPSAxXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldCBsaW5lc3R5bGUgZm9yIHBpeGVsYXRlZCBsYXllclxyXG4gICAgICogTk9URTogd2lkdGggb25seSB3b3JrcyBmb3IgbGluZSgpIGZvciBub3dcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50PTB4ZmZmZmZmXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYT0xXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBsaW5lU3R5bGUod2lkdGgsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZS53aWR0aCA9IHdpZHRoXHJcbiAgICAgICAgdGhpcy5fbGluZVN0eWxlLnRpbnQgPSB0eXBlb2YgdGludCAhPT0gJ3VuZGVmaW5lZCcgPyB0aW50IDogMHhmZmZmZmZcclxuICAgICAgICB0aGlzLl9saW5lU3R5bGUuYWxwaGEgPSB0eXBlb2YgYWxwaGEgIT09ICd1bmRlZmluZWQnID8gYWxwaGEgOiAxXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1vdmUgY3Vyc29yIHRvIHRoaXMgbG9jYXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBtb3ZlVG8oeCwgeSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnNvci54ID0geFxyXG4gICAgICAgIHRoaXMuY3Vyc29yLnkgPSB5XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgYW5kIG1vdmUgY3Vyc29yIHRvIHRoZSBzZWNvbmQgcG9pbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbGluZVdpZHRoXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBsaW5lKHgwLCB5MCwgeDEsIHkxLCB0aW50LCBhbHBoYSwgbGluZVdpZHRoKVxyXG4gICAge1xyXG4gICAgICAgIGxpbmVXaWR0aCA9IHR5cGVvZiBsaW5lV2lkdGggPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLndpZHRoIDogbGluZVdpZHRoXHJcbiAgICAgICAgaWYgKGxpbmVXaWR0aCA9PT0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvaW50cyh0aGlzLmxpbmVQb2ludHMoeDAsIHkwLCB4MSwgeTEpLCB0aW50LCBhbHBoYSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gdGhpcy5saW5lUG9pbnRzKHgwLCB5MCwgeDEsIHkxKVxyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IEFuZ2xlLmFuZ2xlVHdvUG9pbnRzKHgwLCB5MCwgeDEsIHkxKSAtIE1hdGguUEkgLyAyXHJcbiAgICAgICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKGFuZ2xlKVxyXG4gICAgICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSlcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lV2lkdGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRzKE1hdGgucm91bmQoeDAgKyBjb3MgKiBpKSwgTWF0aC5yb3VuZCh5MCArIHNpbiAqIGkpLCBNYXRoLnJvdW5kKHgxICsgY29zICogaSksIE1hdGgucm91bmQoeTEgKyBzaW4gKiBpKSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBhbmQgbW92ZSBjdXJzb3IgdG8gdGhlIHNlY29uZCBwb2ludFxyXG4gICAgICogYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL21hZGJlbmNlL25vZGUtYnJlc2VuaGFtL2Jsb2IvbWFzdGVyL2luZGV4LmpzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkxXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSBbcG9pbnRzXVxyXG4gICAgICogQHJldHVybnMge251bWJlcltdfVxyXG4gICAgICovXHJcbiAgICBsaW5lUG9pbnRzKHgwLCB5MCwgeDEsIHkxLCBwb2ludHMpXHJcbiAgICB7XHJcbiAgICAgICAgcG9pbnRzID0gcG9pbnRzIHx8IFtdXHJcbiAgICAgICAgcG9pbnRzLnB1c2goW3gwLCB5MF0pXHJcbiAgICAgICAgdmFyIGR4ID0geDEgLSB4MDtcclxuICAgICAgICB2YXIgZHkgPSB5MSAtIHkwO1xyXG4gICAgICAgIHZhciBhZHggPSBNYXRoLmFicyhkeCk7XHJcbiAgICAgICAgdmFyIGFkeSA9IE1hdGguYWJzKGR5KTtcclxuICAgICAgICB2YXIgZXBzID0gMDtcclxuICAgICAgICB2YXIgc3ggPSBkeCA+IDAgPyAxIDogLTE7XHJcbiAgICAgICAgdmFyIHN5ID0gZHkgPiAwID8gMSA6IC0xO1xyXG4gICAgICAgIGlmIChhZHggPiBhZHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0geDAsIHkgPSB5MDsgc3ggPCAwID8geCA+PSB4MSA6IHggPD0geDE7IHggKz0gc3gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgICAgIGVwcyArPSBhZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGVwcyA8PCAxKSA+PSBhZHgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgeSArPSBzeTtcclxuICAgICAgICAgICAgICAgICAgICBlcHMgLT0gYWR4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0geDAsIHkgPSB5MDsgc3kgPCAwID8geSA+PSB5MSA6IHkgPD0geTE7IHkgKz0gc3kpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgICAgIGVwcyArPSBhZHg7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGVwcyA8PCAxKSA+PSBhZHkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCArPSBzeDtcclxuICAgICAgICAgICAgICAgICAgICBlcHMgLT0gYWR5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwb2ludHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHVuaXF1ZSBhcnJheVxyXG4gICAgICogZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTIyOTgyMS8xOTU1OTk3XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYVxyXG4gICAgICovXHJcbiAgICBoYXNoVW5pcXVlKGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgc2VlbiA9IHt9XHJcbiAgICAgICAgcmV0dXJuIGEuZmlsdGVyKChpdGVtKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gaXRlbVswXSArICcuJyArIGl0ZW1bMV1cclxuICAgICAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoa2V5KSA/IGZhbHNlIDogKHNlZW5ba2V5XSA9IHRydWUpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBzZXQgb2YgcG9pbnRzLCByZW1vdmluZyBkdXBsaWNhdGVzIGZpcnN0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtvYmplY3RbXX1cclxuICAgICAqL1xyXG4gICAgZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIHBvaW50cyA9IHRoaXMuaGFzaFVuaXF1ZShwb2ludHMpXHJcbiAgICAgICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludChwb2ludFswXSwgcG9pbnRbMV0sIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgbGluZSBmcm9tIHRoZSBjdXJzb3IgcG9zaXRpb24gdG8gdGhpcyBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGxpbmVUbyh4LCB5KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyh0aGlzLmxpbmVQb2ludHModGhpcy5jdXJzb3IueCwgdGhpcy5jdXJzb3IueSwgeCwgeSkpXHJcbiAgICAgICAgdGhpcy5jdXJzb3IueCA9IHhcclxuICAgICAgICB0aGlzLmN1cnNvci55ID0geVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGNpcmNsZVxyXG4gICAgICogZnJvbSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NaWRwb2ludF9jaXJjbGVfYWxnb3JpdGhtXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgY2lyY2xlKHgwLCB5MCwgcmFkaXVzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gcmFkaXVzXHJcbiAgICAgICAgbGV0IHkgPSAwXHJcbiAgICAgICAgbGV0IGRlY2lzaW9uT3ZlcjIgPSAxIC0geCAgIC8vIERlY2lzaW9uIGNyaXRlcmlvbiBkaXZpZGVkIGJ5IDIgZXZhbHVhdGVkIGF0IHg9ciwgeT0wXHJcblxyXG4gICAgICAgIHdoaWxlICh4ID49IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeCArIHgwLCB5ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeSArIHgwLCB4ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbLXggKyB4MCwgeSArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goWy15ICsgeDAsIHggKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFsteCArIHgwLCAteSArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goWy15ICsgeDAsIC14ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeCArIHgwLCAteSArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3kgKyB4MCwgLXggKyB5MF0pXHJcbiAgICAgICAgICAgIHkrK1xyXG4gICAgICAgICAgICBpZiAoZGVjaXNpb25PdmVyMiA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbk92ZXIyICs9IDIgKiB5ICsgMSAvLyBDaGFuZ2UgaW4gZGVjaXNpb24gY3JpdGVyaW9uIGZvciB5IC0+IHkrMVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeC0tXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbk92ZXIyICs9IDIgKiAoeSAtIHgpICsgMSAvLyBDaGFuZ2UgZm9yIHkgLT4geSsxLCB4IC0+IHgtMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFuZCBmaWxsIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqL1xyXG4gICAgY2lyY2xlRmlsbCh4MCwgeTAsIHJhZGl1cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBsZXQgeCA9IHJhZGl1c1xyXG4gICAgICAgIGxldCB5ID0gMFxyXG4gICAgICAgIGxldCBkZWNpc2lvbk92ZXIyID0gMSAtIHggICAvLyBEZWNpc2lvbiBjcml0ZXJpb24gZGl2aWRlZCBieSAyIGV2YWx1YXRlZCBhdCB4PXIsIHk9MFxyXG5cclxuICAgICAgICB3aGlsZSAoeCA+PSB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKC14ICsgeDAsIHkgKyB5MCwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cygteSArIHgwLCB4ICsgeTAsIHkgKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoLXggKyB4MCwgLXkgKyB5MCwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cygteSArIHgwLCAteCArIHkwLCB5ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgeSsrXHJcbiAgICAgICAgICAgIGlmIChkZWNpc2lvbk92ZXIyIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqIHkgKyAxIC8vIENoYW5nZSBpbiBkZWNpc2lvbiBjcml0ZXJpb24gZm9yIHkgLT4geSsxXHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4LS1cclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqICh5IC0geCkgKyAxIC8vIENoYW5nZSBmb3IgeSAtPiB5KzEsIHggLT4geC0xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZXR1cm4gYW4gYXJyYXkgb2YgcG9pbnRzIGZvciBhIHJlY3RcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSBbcG9pbnRzXVxyXG4gICAgICogQHJldHVybnMge29iamVjdFtdfVxyXG4gICAgICovXHJcbiAgICByZWN0UG9pbnRzKHgwLCB5MCwgd2lkdGgsIGhlaWdodCwgcG9pbnRzKVxyXG4gICAge1xyXG4gICAgICAgIHBvaW50cyA9IHBvaW50cyB8fCBbXVxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MDsgeSA8IHkwICsgaGVpZ2h0OyB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geDA7IHggPCB4MCArIHdpZHRoOyB4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcG9pbnRzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IHRoZSBvdXRsaW5lIG9mIGEgcmVjdFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm4ge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICByZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh3aWR0aCA9PT0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgICAgIHBvaW50LndpZHRoID0gMVxyXG4gICAgICAgICAgICBwb2ludC5oZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGVpZ2h0ID09PSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICBwb2ludC5wb3NpdGlvbi5zZXQoeCwgeSlcclxuICAgICAgICAgICAgcG9pbnQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIHBvaW50LmhlaWdodCA9IDFcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgdG9wID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgdG9wLnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgICAgICB0b3Aud2lkdGggPSB3aWR0aCArIDFcclxuICAgICAgICAgICAgdG9wLmhlaWdodCA9IDFcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgYm90dG9tLnBvc2l0aW9uLnNldCh4LCB5ICsgaGVpZ2h0KVxyXG4gICAgICAgICAgICBib3R0b20ud2lkdGggPSB3aWR0aCArIDFcclxuICAgICAgICAgICAgYm90dG9tLmhlaWdodCA9IDFcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIGxlZnQucG9zaXRpb24uc2V0KHgsIHkgKyAxKVxyXG4gICAgICAgICAgICBsZWZ0LndpZHRoID0gMVxyXG4gICAgICAgICAgICBsZWZ0LmhlaWdodCA9IGhlaWdodCAtIDFcclxuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICByaWdodC5wb3NpdGlvbi5zZXQoeCArIHdpZHRoLCB5ICsgMSlcclxuICAgICAgICAgICAgcmlnaHQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIHJpZ2h0LmhlaWdodCA9IGhlaWdodCAtIDFcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYW5kIGZpbGwgcmVjdGFuZ2xlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcmVjdEZpbGwoeCwgeSwgd2lkdGgsIGhlaWdodCwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHBvaW50LnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgIHBvaW50LndpZHRoID0gd2lkdGggKyAxXHJcbiAgICAgICAgcG9pbnQuaGVpZ2h0ID0gaGVpZ2h0ICsgMVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGVsbGlwc2VcclxuICAgICAqIGZyb20gaHR0cDovL2NmZXRjaC5ibG9nc3BvdC50dy8yMDE0LzAxL3dhcC10by1kcmF3LWVsbGlwc2UtdXNpbmctbWlkcG9pbnQuaHRtbFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhjIGNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHljIGNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ4IC0gcmFkaXVzIHgtYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ5IC0gcmFkaXVzIHktYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBlbGxpcHNlKHhjLCB5YywgcngsIHJ5LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gMCwgeSA9IHJ5XHJcbiAgICAgICAgbGV0IHAgPSAocnkgKiByeSkgLSAocnggKiByeCAqIHJ5KSArICgocnggKiByeCkgLyA0KVxyXG4gICAgICAgIHdoaWxlICgoMiAqIHggKiByeSAqIHJ5KSA8ICgyICogeSAqIHJ4ICogcngpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgLSB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgLSB5XSlcclxuXHJcbiAgICAgICAgICAgIGlmIChwIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHgpICsgKHJ5ICogcnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4ICsgcnkgKiByeSkgLSAoMiAqIHJ4ICogcnggKiB5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHAgPSAoeCArIDAuNSkgKiAoeCArIDAuNSkgKiByeSAqIHJ5ICsgKHkgLSAxKSAqICh5IC0gMSkgKiByeCAqIHJ4IC0gcnggKiByeCAqIHJ5ICogcnlcclxuICAgICAgICB3aGlsZSAoeSA+PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgLSB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgLSB5XSlcclxuICAgICAgICAgICAgaWYgKHAgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwIC0gKDIgKiByeCAqIHJ4ICogeSkgKyAocnggKiByeClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHgpIC0gKDIgKiByeCAqIHJ4ICogeSkgLSAocnggKiByeClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhbmQgZmlsbCBlbGxpcHNlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geGMgLSB4LWNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHljIC0geS1jZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByeCAtIHJhZGl1cyB4LWF4aXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByeSAtIHJhZGl1cyB5LWF4aXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGVsbGlwc2VGaWxsKHhjLCB5YywgcngsIHJ5LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gMCwgeSA9IHJ5XHJcbiAgICAgICAgbGV0IHAgPSAocnkgKiByeSkgLSAocnggKiByeCAqIHJ5KSArICgocnggKiByeCkgLyA0KVxyXG4gICAgICAgIHdoaWxlICgoMiAqIHggKiByeSAqIHJ5KSA8ICgyICogeSAqIHJ4ICogcngpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKHhjIC0geCwgeWMgLSB5LCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKHhjIC0geCwgeWMgKyB5LCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgaWYgKHAgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgKyAocnkgKiByeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHggKyByeSAqIHJ5KSAtICgyICogcnggKiByeCAqIHkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9ICh4ICsgMC41KSAqICh4ICsgMC41KSAqIHJ5ICogcnkgKyAoeSAtIDEpICogKHkgLSAxKSAqIHJ4ICogcnggLSByeCAqIHJ4ICogcnkgKiByeVxyXG4gICAgICAgIHdoaWxlICh5ID49IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyAtIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyArIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICBpZiAocCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgLSAoMiAqIHJ4ICogcnggKiB5KSArIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgLSAoMiAqIHJ4ICogcnggKiB5KSAtIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIHBvbHlnb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IHZlcnRpY2VzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHBvbHlnb24odmVydGljZXMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubGluZVBvaW50cyh2ZXJ0aWNlc1tpIC0gMl0sIHZlcnRpY2VzW2kgLSAxXSwgdmVydGljZXNbaV0sIHZlcnRpY2VzW2kgKyAxXSwgcG9pbnRzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmVydGljZXNbdmVydGljZXMubGVuZ3RoIC0gMl0gIT09IHZlcnRpY2VzWzBdIHx8IHZlcnRpY2VzW3ZlcnRpY2VzLmxlbmd0aCAtIDFdICE9PSB2ZXJ0aWNlc1sxXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubGluZVBvaW50cyh2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAyXSwgdmVydGljZXNbdmVydGljZXMubGVuZ3RoIC0gMV0sIHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1sxXSwgcG9pbnRzKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYW5kIGZpbGwgcGl4ZWxhdGVkIHBvbHlnb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IHZlcnRpY2VzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHBvbHlnb25GaWxsKHZlcnRpY2VzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBmdW5jdGlvbiBtb2QobiwgbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKG4gJSBtKSArIG0pICUgbVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBjb25zdCBlZGdlcyA9IFtdLCBhY3RpdmUgPSBbXVxyXG4gICAgICAgIGxldCBtaW5ZID0gSW5maW5pdHksIG1heFkgPSAwXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBwMSA9IHsgeDogdmVydGljZXNbaV0sIHk6IHZlcnRpY2VzW2kgKyAxXSB9XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0geyB4OiB2ZXJ0aWNlc1ttb2QoaSArIDIsIHZlcnRpY2VzLmxlbmd0aCldLCB5OiB2ZXJ0aWNlc1ttb2QoaSArIDMsIHZlcnRpY2VzLmxlbmd0aCldIH1cclxuICAgICAgICAgICAgaWYgKHAxLnkgLSBwMi55ICE9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGdlID0ge31cclxuICAgICAgICAgICAgICAgIGVkZ2UucDEgPSBwMVxyXG4gICAgICAgICAgICAgICAgZWRnZS5wMiA9IHAyXHJcbiAgICAgICAgICAgICAgICBpZiAocDEueSA8IHAyLnkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5taW5ZID0gcDEueVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UubWluWCA9IHAxLnhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLm1pblkgPSBwMi55XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5taW5YID0gcDIueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbWluWSA9IChlZGdlLm1pblkgPCBtaW5ZKSA/IGVkZ2UubWluWSA6IG1pbllcclxuICAgICAgICAgICAgICAgIGVkZ2UubWF4WSA9IE1hdGgubWF4KHAxLnksIHAyLnkpXHJcbiAgICAgICAgICAgICAgICBtYXhZID0gKGVkZ2UubWF4WSA+IG1heFkpID8gZWRnZS5tYXhZIDogbWF4WVxyXG4gICAgICAgICAgICAgICAgaWYgKHAxLnggLSBwMi54ID09PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2Uuc2xvcGUgPSBJbmZpbml0eVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UuYiA9IHAxLnhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLnNsb3BlID0gKHAxLnkgLSBwMi55KSAvIChwMS54IC0gcDIueClcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLmIgPSBwMS55IC0gZWRnZS5zbG9wZSAqIHAxLnhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVkZ2VzLnB1c2goZWRnZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlZGdlcy5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhLm1pblkgLSBiLm1pblkgfSlcclxuICAgICAgICBmb3IgKGxldCB5ID0gbWluWTsgeSA8PSBtYXhZOyB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGdlID0gZWRnZXNbaV1cclxuICAgICAgICAgICAgICAgIGlmIChlZGdlLm1pblkgPT09IHkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2goZWRnZSlcclxuICAgICAgICAgICAgICAgICAgICBlZGdlcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgICAgICBpLS1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGl2ZS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWRnZSA9IGFjdGl2ZVtpXVxyXG4gICAgICAgICAgICAgICAgaWYgKGVkZ2UubWF4WSA8IHkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGktLVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGdlLnNsb3BlICE9PSBJbmZpbml0eSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2UueCA9IE1hdGgucm91bmQoKHkgLSBlZGdlLmIpIC8gZWRnZS5zbG9wZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZS54ID0gZWRnZS5iXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFjdGl2ZS5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhLnggLSBiLnggPT09IDAgPyBiLm1heFkgLSBhLm1heFkgOiBhLnggLSBiLnggfSlcclxuICAgICAgICAgICAgbGV0IGJpdCA9IHRydWUsIGN1cnJlbnQgPSAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBhY3RpdmVbMF0ueDsgeCA8PSBhY3RpdmVbYWN0aXZlLmxlbmd0aCAtIDFdLng7IHgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJpdClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChbeCwgeV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlW2N1cnJlbnRdLnggPT09IHgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVtjdXJyZW50XS5tYXhZICE9PSB5KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYml0ID0gIWJpdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50KytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhcmNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MCAtIHgtc3RhcnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MCAtIHktc3RhcnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSByYWRpdXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBhbmdsZSAocmFkaWFucylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgYW5nbGUgKHJhZGlhbnMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGFyYyh4MCwgeTAsIHJhZGl1cywgc3RhcnQsIGVuZCwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLlBJIC8gcmFkaXVzIC8gNFxyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSArPSBpbnRlcnZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFtNYXRoLmZsb29yKHgwICsgTWF0aC5jb3MoaSkgKiByYWRpdXMpLCBNYXRoLmZsb29yKHkwICsgTWF0aC5zaW4oaSkgKiByYWRpdXMpXSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVtcHRpZXMgY2FjaGUgb2Ygb2xkIHNwcml0ZXNcclxuICAgICAqL1xyXG4gICAgZmx1c2goKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXVxyXG4gICAgfVxyXG59XHJcblxyXG5QaXhlbGF0ZS5fdGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5XSElURVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaXhlbGF0ZSJdfQ==