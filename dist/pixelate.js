'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PIXI = require('pixi.js');

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
        _this._lineStyle = { tint: 0xffffff, alpha: 1 };
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
         * TODO: add width option
         * @param {number} [tint=0xffffff]
         * @param {number} [alpha=1]
         * @returns {Pixelate}
         */

    }, {
        key: 'lineStyle',
        value: function lineStyle(tint, alpha) {
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
         * @returns {Pixelate}
         */

    }, {
        key: 'line',
        value: function line(x0, y0, x1, y1, tint, alpha) {
            this.drawPoints(this.linePoints(x0, y0, x1, y1), tint, alpha);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXhlbGF0ZS5qcyJdLCJuYW1lcyI6WyJQSVhJIiwicmVxdWlyZSIsIlBpeGVsYXRlIiwiY3Vyc29yIiwieCIsInkiLCJ0aW50IiwiX2xpbmVTdHlsZSIsImFscGhhIiwiY2FjaGUiLCJjaGlsZHJlbiIsImxlbmd0aCIsInB1c2giLCJwb3AiLCJwb2ludCIsImFkZENoaWxkIiwiU3ByaXRlIiwidGV4dHVyZSIsInBvaW50cyIsImlzTmFOIiwiaSIsImdldFBvaW50IiwicG9zaXRpb24iLCJzZXQiLCJ3aWR0aCIsImhlaWdodCIsIngwIiwieTAiLCJ4MSIsInkxIiwiZHJhd1BvaW50cyIsImxpbmVQb2ludHMiLCJkeCIsImR5IiwiYWR4IiwiTWF0aCIsImFicyIsImFkeSIsImVwcyIsInN4Iiwic3kiLCJhIiwic2VlbiIsImZpbHRlciIsIml0ZW0iLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImhhc2hVbmlxdWUiLCJyYWRpdXMiLCJkZWNpc2lvbk92ZXIyIiwicmVjdFBvaW50cyIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJyaWdodCIsInhjIiwieWMiLCJyeCIsInJ5IiwicCIsInZlcnRpY2VzIiwibW9kIiwibiIsIm0iLCJlZGdlcyIsImFjdGl2ZSIsIm1pblkiLCJJbmZpbml0eSIsIm1heFkiLCJwMSIsInAyIiwiZWRnZSIsIm1pblgiLCJtYXgiLCJzbG9wZSIsImIiLCJzb3J0Iiwic3BsaWNlIiwicm91bmQiLCJiaXQiLCJjdXJyZW50Iiwic3RhcnQiLCJlbmQiLCJpbnRlcnZhbCIsIlBJIiwiZmxvb3IiLCJjb3MiLCJzaW4iLCJfdGV4dHVyZSIsInZhbHVlIiwiQ29udGFpbmVyIiwiVGV4dHVyZSIsIldISVRFIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLE9BQU9DLFFBQVEsU0FBUixDQUFiOztBQUVBOzs7O0lBR01DLFE7OztBQUVGLHdCQUNBO0FBQUE7O0FBQUE7O0FBRUksY0FBS0Ms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RCxHQUF6QixFQUE4QjlELEtBQUsrRCxRQUFuQyxFQUNBO0FBQ0lqRSx1QkFBT04sSUFBUCxDQUFZLENBQUN1QixLQUFLa0QsS0FBTCxDQUFXM0QsS0FBS1MsS0FBS21ELEdBQUwsQ0FBU2xFLENBQVQsSUFBYzRCLE1BQTlCLENBQUQsRUFBd0NiLEtBQUtrRCxLQUFMLENBQVcxRCxLQUFLUSxLQUFLb0QsR0FBTCxDQUFTbkUsQ0FBVCxJQUFjNEIsTUFBOUIsQ0FBeEMsQ0FBWjtBQUNIO0FBQ0QsaUJBQUtsQixVQUFMLENBQWdCWixNQUFoQixFQUF3QlosSUFBeEIsRUFBOEJFLEtBQTlCO0FBQ0EsbUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Z0NBSUE7QUFDSSxpQkFBS0MsS0FBTCxHQUFhLEVBQWI7QUFDSDs7OzRCQWpvQkQ7QUFDSSxtQkFBT1AsU0FBU3NGLFFBQWhCO0FBQ0gsUzswQkFDa0JDLEssRUFDbkI7QUFDSXZGLHFCQUFTc0YsUUFBVCxHQUFvQkMsS0FBcEI7QUFDSDs7OztFQWpDa0J6RixLQUFLMEYsUzs7QUErcEI1QnhGLFNBQVNzRixRQUFULEdBQW9CeEYsS0FBSzJGLE9BQUwsQ0FBYUMsS0FBakM7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUI1RixRQUFqQiIsImZpbGUiOiJwaXhlbGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBJWEkgPSByZXF1aXJlKCdwaXhpLmpzJylcclxuXHJcbi8qKlxyXG4gKiBwaXhpLXBpeGVsYXRlOiBhIGNvbnRhaW5lciB0byBjcmVhdGUgcHJvcGVyIHBpeGVsYXRlZCBncmFwaGljc1xyXG4gKi9cclxuY2xhc3MgUGl4ZWxhdGUgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuY3Vyc29yID0geyB4OiAwLCB5OiAwIH1cclxuICAgICAgICB0aGlzLnRpbnQgPSAweGZmZmZmZlxyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZSA9IHsgdGludDogMHhmZmZmZmYsIGFscGhhOiAxIH1cclxuICAgICAgICB0aGlzLmNhY2hlID0gW11cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNsZWFyIGFsbCBncmFwaGljc1xyXG4gICAgICovXHJcbiAgICBjbGVhcigpXHJcbiAgICB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHRoaXMuY2hpbGRyZW4ucG9wKCkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGV4dHVyZSB0byB1c2UgZm9yIHNwcml0ZXMgKGRlZmF1bHRzIHRvIFBJWEkuVGV4dHVyZS5XSElURSlcclxuICAgICAqIEB0eXBlIHtQSVhJLlRleHR1cmV9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgdGV4dHVyZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFBpeGVsYXRlLl90ZXh0dXJlXHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2V0IHRleHR1cmUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgUGl4ZWxhdGUuX3RleHR1cmUgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlcyBvciBnZXRzIGFuIG9sZCBzcHJpdGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBwb2ludFxyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlLmxlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcy5hZGRDaGlsZCh0aGlzLmNhY2hlLnBvcCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludCA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuU3ByaXRlKFBpeGVsYXRlLnRleHR1cmUpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludC50aW50ID0gdHlwZW9mIHRpbnQgPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLnRpbnQgOiB0aW50XHJcbiAgICAgICAgcG9pbnQuYWxwaGEgPSB0eXBlb2YgYWxwaGEgPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLmFscGhhIDogYWxwaGFcclxuICAgICAgICByZXR1cm4gcG9pbnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBsaXN0IG9mIHBvaW50c1xyXG4gICAgICogQHBhcmFtIHsobnVtYmVyW118UElYSS5Qb2ludFtdfFBJWEkuUG9pbnRMaWtlW10pfSBwb2ludHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqL1xyXG4gICAgcG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHBvaW50c1swXSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnQocG9pbnQueCwgcG9pbnQueSwgdGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnQocG9pbnRzW2ldLCBwb2ludHNbaSArIDFdLCB0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZCBhIHBvaW50IHVzaW5nIGxpbmVTdHlsZSBvciBwcm92aWRlZCB0aW50IGFuZCBhbHBoYVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBwb2ludCh4LCB5LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgcG9pbnQud2lkdGggPSBwb2ludC5oZWlnaHQgPSAxXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldCBsaW5lc3R5bGUgZm9yIHBpeGVsYXRlZCBsYXllclxyXG4gICAgICogVE9ETzogYWRkIHdpZHRoIG9wdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50PTB4ZmZmZmZmXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYT0xXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBsaW5lU3R5bGUodGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fbGluZVN0eWxlLnRpbnQgPSB0eXBlb2YgdGludCAhPT0gJ3VuZGVmaW5lZCcgPyB0aW50IDogMHhmZmZmZmZcclxuICAgICAgICB0aGlzLl9saW5lU3R5bGUuYWxwaGEgPSB0eXBlb2YgYWxwaGEgIT09ICd1bmRlZmluZWQnID8gYWxwaGEgOiAxXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1vdmUgY3Vyc29yIHRvIHRoaXMgbG9jYXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBtb3ZlVG8oeCwgeSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnNvci54ID0geFxyXG4gICAgICAgIHRoaXMuY3Vyc29yLnkgPSB5XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgYW5kIG1vdmUgY3Vyc29yIHRvIHRoZSBzZWNvbmQgcG9pbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgbGluZSh4MCwgeTAsIHgxLCB5MSwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHRoaXMubGluZVBvaW50cyh4MCwgeTAsIHgxLCB5MSksIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIGFuZCBtb3ZlIGN1cnNvciB0byB0aGUgc2Vjb25kIHBvaW50XHJcbiAgICAgKiBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbWFkYmVuY2Uvbm9kZS1icmVzZW5oYW0vYmxvYi9tYXN0ZXIvaW5kZXguanNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgxXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IFtwb2ludHNdXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcbiAgICAgKi9cclxuICAgIGxpbmVQb2ludHMoeDAsIHkwLCB4MSwgeTEsIHBvaW50cylcclxuICAgIHtcclxuICAgICAgICBwb2ludHMgPSBwb2ludHMgfHwgW11cclxuICAgICAgICBwb2ludHMucHVzaChbeDAsIHkwXSlcclxuICAgICAgICB2YXIgZHggPSB4MSAtIHgwO1xyXG4gICAgICAgIHZhciBkeSA9IHkxIC0geTA7XHJcbiAgICAgICAgdmFyIGFkeCA9IE1hdGguYWJzKGR4KTtcclxuICAgICAgICB2YXIgYWR5ID0gTWF0aC5hYnMoZHkpO1xyXG4gICAgICAgIHZhciBlcHMgPSAwO1xyXG4gICAgICAgIHZhciBzeCA9IGR4ID4gMCA/IDEgOiAtMTtcclxuICAgICAgICB2YXIgc3kgPSBkeSA+IDAgPyAxIDogLTE7XHJcbiAgICAgICAgaWYgKGFkeCA+IGFkeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSB4MCwgeSA9IHkwOyBzeCA8IDAgPyB4ID49IHgxIDogeCA8PSB4MTsgeCArPSBzeClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goW3gsIHldKVxyXG4gICAgICAgICAgICAgICAgZXBzICs9IGFkeTtcclxuICAgICAgICAgICAgICAgIGlmICgoZXBzIDw8IDEpID49IGFkeClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB5ICs9IHN5O1xyXG4gICAgICAgICAgICAgICAgICAgIGVwcyAtPSBhZHg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSB4MCwgeSA9IHkwOyBzeSA8IDAgPyB5ID49IHkxIDogeSA8PSB5MTsgeSArPSBzeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goW3gsIHldKVxyXG4gICAgICAgICAgICAgICAgZXBzICs9IGFkeDtcclxuICAgICAgICAgICAgICAgIGlmICgoZXBzIDw8IDEpID49IGFkeSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB4ICs9IHN4O1xyXG4gICAgICAgICAgICAgICAgICAgIGVwcyAtPSBhZHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBvaW50c1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgdW5pcXVlIGFycmF5XHJcbiAgICAgKiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MjI5ODIxLzE5NTU5OTdcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhXHJcbiAgICAgKi9cclxuICAgIGhhc2hVbmlxdWUoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBzZWVuID0ge31cclxuICAgICAgICByZXR1cm4gYS5maWx0ZXIoKGl0ZW0pID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBpdGVtWzBdICsgJy4nICsgaXRlbVsxXVxyXG4gICAgICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrZXkpID8gZmFsc2UgOiAoc2VlbltrZXldID0gdHJ1ZSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHNldCBvZiBwb2ludHMsIHJlbW92aW5nIGR1cGxpY2F0ZXMgZmlyc3RcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdFtdfVxyXG4gICAgICovXHJcbiAgICBkcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgcG9pbnRzID0gdGhpcy5oYXNoVW5pcXVlKHBvaW50cylcclxuICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50KHBvaW50WzBdLCBwb2ludFsxXSwgdGludCwgYWxwaGEpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBsaW5lIGZyb20gdGhlIGN1cnNvciBwb3NpdGlvbiB0byB0aGlzIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgbGluZVRvKHgsIHkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHRoaXMubGluZVBvaW50cyh0aGlzLmN1cnNvci54LCB0aGlzLmN1cnNvci55LCB4LCB5KSlcclxuICAgICAgICB0aGlzLmN1cnNvci54ID0geFxyXG4gICAgICAgIHRoaXMuY3Vyc29yLnkgPSB5XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgY2lyY2xlXHJcbiAgICAgKiBmcm9tIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01pZHBvaW50X2NpcmNsZV9hbGdvcml0aG1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBjaXJjbGUoeDAsIHkwLCByYWRpdXMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgbGV0IHggPSByYWRpdXNcclxuICAgICAgICBsZXQgeSA9IDBcclxuICAgICAgICBsZXQgZGVjaXNpb25PdmVyMiA9IDEgLSB4ICAgLy8gRGVjaXNpb24gY3JpdGVyaW9uIGRpdmlkZWQgYnkgMiBldmFsdWF0ZWQgYXQgeD1yLCB5PTBcclxuXHJcbiAgICAgICAgd2hpbGUgKHggPj0geSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4ICsgeDAsIHkgKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt5ICsgeDAsIHggKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFsteCArIHgwLCB5ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbLXkgKyB4MCwgeCArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goWy14ICsgeDAsIC15ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbLXkgKyB4MCwgLXggKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4ICsgeDAsIC15ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeSArIHgwLCAteCArIHkwXSlcclxuICAgICAgICAgICAgeSsrXHJcbiAgICAgICAgICAgIGlmIChkZWNpc2lvbk92ZXIyIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqIHkgKyAxIC8vIENoYW5nZSBpbiBkZWNpc2lvbiBjcml0ZXJpb24gZm9yIHkgLT4geSsxXHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4LS1cclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqICh5IC0geCkgKyAxIC8vIENoYW5nZSBmb3IgeSAtPiB5KzEsIHggLT4geC0xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYW5kIGZpbGwgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IGNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICovXHJcbiAgICBjaXJjbGVGaWxsKHgwLCB5MCwgcmFkaXVzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gcmFkaXVzXHJcbiAgICAgICAgbGV0IHkgPSAwXHJcbiAgICAgICAgbGV0IGRlY2lzaW9uT3ZlcjIgPSAxIC0geCAgIC8vIERlY2lzaW9uIGNyaXRlcmlvbiBkaXZpZGVkIGJ5IDIgZXZhbHVhdGVkIGF0IHg9ciwgeT0wXHJcblxyXG4gICAgICAgIHdoaWxlICh4ID49IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoLXggKyB4MCwgeSArIHkwLCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKC15ICsgeDAsIHggKyB5MCwgeSAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cygteCArIHgwLCAteSArIHkwLCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKC15ICsgeDAsIC14ICsgeTAsIHkgKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB5KytcclxuICAgICAgICAgICAgaWYgKGRlY2lzaW9uT3ZlcjIgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25PdmVyMiArPSAyICogeSArIDEgLy8gQ2hhbmdlIGluIGRlY2lzaW9uIGNyaXRlcmlvbiBmb3IgeSAtPiB5KzFcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHgtLVxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25PdmVyMiArPSAyICogKHkgLSB4KSArIDEgLy8gQ2hhbmdlIGZvciB5IC0+IHkrMSwgeCAtPiB4LTFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybiBhbiBhcnJheSBvZiBwb2ludHMgZm9yIGEgcmVjdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IFtwb2ludHNdXHJcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0W119XHJcbiAgICAgKi9cclxuICAgIHJlY3RQb2ludHMoeDAsIHkwLCB3aWR0aCwgaGVpZ2h0LCBwb2ludHMpXHJcbiAgICB7XHJcbiAgICAgICAgcG9pbnRzID0gcG9pbnRzIHx8IFtdXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkwOyB5IDwgeTAgKyBoZWlnaHQ7IHkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4MDsgeCA8IHgwICsgd2lkdGg7IHgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goW3gsIHldKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwb2ludHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgdGhlIG91dGxpbmUgb2YgYSByZWN0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICogQHJldHVybiB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHdpZHRoID09PSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICBwb2ludC5wb3NpdGlvbi5zZXQoeCwgeSlcclxuICAgICAgICAgICAgcG9pbnQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIHBvaW50LmhlaWdodCA9IGhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoZWlnaHQgPT09IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIHBvaW50LnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgICAgICBwb2ludC53aWR0aCA9IDFcclxuICAgICAgICAgICAgcG9pbnQuaGVpZ2h0ID0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICB0b3AucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgICAgIHRvcC53aWR0aCA9IHdpZHRoICsgMVxyXG4gICAgICAgICAgICB0b3AuaGVpZ2h0ID0gMVxyXG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICBib3R0b20ucG9zaXRpb24uc2V0KHgsIHkgKyBoZWlnaHQpXHJcbiAgICAgICAgICAgIGJvdHRvbS53aWR0aCA9IHdpZHRoICsgMVxyXG4gICAgICAgICAgICBib3R0b20uaGVpZ2h0ID0gMVxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgbGVmdC5wb3NpdGlvbi5zZXQoeCwgeSArIDEpXHJcbiAgICAgICAgICAgIGxlZnQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIGxlZnQuaGVpZ2h0ID0gaGVpZ2h0IC0gMVxyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIHJpZ2h0LnBvc2l0aW9uLnNldCh4ICsgd2lkdGgsIHkgKyAxKVxyXG4gICAgICAgICAgICByaWdodC53aWR0aCA9IDFcclxuICAgICAgICAgICAgcmlnaHQuaGVpZ2h0ID0gaGVpZ2h0IC0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhbmQgZmlsbCByZWN0YW5nbGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICByZWN0RmlsbCh4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgcG9pbnQud2lkdGggPSB3aWR0aCArIDFcclxuICAgICAgICBwb2ludC5oZWlnaHQgPSBoZWlnaHQgKyAxXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgZWxsaXBzZVxyXG4gICAgICogZnJvbSBodHRwOi8vY2ZldGNoLmJsb2dzcG90LnR3LzIwMTQvMDEvd2FwLXRvLWRyYXctZWxsaXBzZS11c2luZy1taWRwb2ludC5odG1sXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geGMgY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWMgY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnggLSByYWRpdXMgeC1heGlzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnkgLSByYWRpdXMgeS1heGlzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGVsbGlwc2UoeGMsIHljLCByeCwgcnksIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgbGV0IHggPSAwLCB5ID0gcnlcclxuICAgICAgICBsZXQgcCA9IChyeSAqIHJ5KSAtIChyeCAqIHJ4ICogcnkpICsgKChyeCAqIHJ4KSAvIDQpXHJcbiAgICAgICAgd2hpbGUgKCgyICogeCAqIHJ5ICogcnkpIDwgKDIgKiB5ICogcnggKiByeCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyAtIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyAtIHldKVxyXG5cclxuICAgICAgICAgICAgaWYgKHAgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgKyAocnkgKiByeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHggKyByeSAqIHJ5KSAtICgyICogcnggKiByeCAqIHkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9ICh4ICsgMC41KSAqICh4ICsgMC41KSAqIHJ5ICogcnkgKyAoeSAtIDEpICogKHkgLSAxKSAqIHJ4ICogcnggLSByeCAqIHJ4ICogcnkgKiByeVxyXG4gICAgICAgIHdoaWxlICh5ID49IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyAtIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyAtIHldKVxyXG4gICAgICAgICAgICBpZiAocCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgLSAoMiAqIHJ4ICogcnggKiB5KSArIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgLSAoMiAqIHJ4ICogcnggKiB5KSAtIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFuZCBmaWxsIGVsbGlwc2VcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4YyAtIHgtY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWMgLSB5LWNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ4IC0gcmFkaXVzIHgtYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ5IC0gcmFkaXVzIHktYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgZWxsaXBzZUZpbGwoeGMsIHljLCByeCwgcnksIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgbGV0IHggPSAwLCB5ID0gcnlcclxuICAgICAgICBsZXQgcCA9IChyeSAqIHJ5KSAtIChyeCAqIHJ4ICogcnkpICsgKChyeCAqIHJ4KSAvIDQpXHJcbiAgICAgICAgd2hpbGUgKCgyICogeCAqIHJ5ICogcnkpIDwgKDIgKiB5ICogcnggKiByeCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyAtIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyArIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICBpZiAocCA8IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4KSArIChyeSAqIHJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCArIHJ5ICogcnkpIC0gKDIgKiByeCAqIHJ4ICogeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwID0gKHggKyAwLjUpICogKHggKyAwLjUpICogcnkgKiByeSArICh5IC0gMSkgKiAoeSAtIDEpICogcnggKiByeCAtIHJ4ICogcnggKiByeSAqIHJ5XHJcbiAgICAgICAgd2hpbGUgKHkgPj0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cyh4YyAtIHgsIHljIC0geSwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cyh4YyAtIHgsIHljICsgeSwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIGlmIChwID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCAtICgyICogcnggKiByeCAqIHkpICsgKHJ4ICogcngpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4KSAtICgyICogcnggKiByeCAqIHkpIC0gKHJ4ICogcngpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgcG9seWdvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gdmVydGljZXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcG9seWdvbih2ZXJ0aWNlcywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRzKHZlcnRpY2VzW2kgLSAyXSwgdmVydGljZXNbaSAtIDFdLCB2ZXJ0aWNlc1tpXSwgdmVydGljZXNbaSArIDFdLCBwb2ludHMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAyXSAhPT0gdmVydGljZXNbMF0gfHwgdmVydGljZXNbdmVydGljZXMubGVuZ3RoIC0gMV0gIT09IHZlcnRpY2VzWzFdKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRzKHZlcnRpY2VzW3ZlcnRpY2VzLmxlbmd0aCAtIDJdLCB2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAxXSwgdmVydGljZXNbMF0sIHZlcnRpY2VzWzFdLCBwb2ludHMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhbmQgZmlsbCBwaXhlbGF0ZWQgcG9seWdvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gdmVydGljZXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcG9seWdvbkZpbGwodmVydGljZXMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGZ1bmN0aW9uIG1vZChuLCBtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuICgobiAlIG0pICsgbSkgJSBtXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGNvbnN0IGVkZ2VzID0gW10sIGFjdGl2ZSA9IFtdXHJcbiAgICAgICAgbGV0IG1pblkgPSBJbmZpbml0eSwgbWF4WSA9IDBcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAxID0geyB4OiB2ZXJ0aWNlc1tpXSwgeTogdmVydGljZXNbaSArIDFdIH1cclxuICAgICAgICAgICAgY29uc3QgcDIgPSB7IHg6IHZlcnRpY2VzW21vZChpICsgMiwgdmVydGljZXMubGVuZ3RoKV0sIHk6IHZlcnRpY2VzW21vZChpICsgMywgdmVydGljZXMubGVuZ3RoKV0gfVxyXG4gICAgICAgICAgICBpZiAocDEueSAtIHAyLnkgIT09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVkZ2UgPSB7fVxyXG4gICAgICAgICAgICAgICAgZWRnZS5wMSA9IHAxXHJcbiAgICAgICAgICAgICAgICBlZGdlLnAyID0gcDJcclxuICAgICAgICAgICAgICAgIGlmIChwMS55IDwgcDIueSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLm1pblkgPSBwMS55XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5taW5YID0gcDEueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UubWluWSA9IHAyLnlcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLm1pblggPSBwMi54XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtaW5ZID0gKGVkZ2UubWluWSA8IG1pblkpID8gZWRnZS5taW5ZIDogbWluWVxyXG4gICAgICAgICAgICAgICAgZWRnZS5tYXhZID0gTWF0aC5tYXgocDEueSwgcDIueSlcclxuICAgICAgICAgICAgICAgIG1heFkgPSAoZWRnZS5tYXhZID4gbWF4WSkgPyBlZGdlLm1heFkgOiBtYXhZXHJcbiAgICAgICAgICAgICAgICBpZiAocDEueCAtIHAyLnggPT09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5zbG9wZSA9IEluZmluaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5iID0gcDEueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2Uuc2xvcGUgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UuYiA9IHAxLnkgLSBlZGdlLnNsb3BlICogcDEueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWRnZXMucHVzaChlZGdlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVkZ2VzLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEubWluWSAtIGIubWluWSB9KVxyXG4gICAgICAgIGZvciAobGV0IHkgPSBtaW5ZOyB5IDw9IG1heFk7IHkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVkZ2UgPSBlZGdlc1tpXVxyXG4gICAgICAgICAgICAgICAgaWYgKGVkZ2UubWluWSA9PT0geSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUucHVzaChlZGdlKVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGktLVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aXZlLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGdlID0gYWN0aXZlW2ldXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRnZS5tYXhZIDwgeSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgaS0tXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2Uuc2xvcGUgIT09IEluZmluaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZS54ID0gTWF0aC5yb3VuZCgoeSAtIGVkZ2UuYikgLyBlZGdlLnNsb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlLnggPSBlZGdlLmJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWN0aXZlLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEueCAtIGIueCA9PT0gMCA/IGIubWF4WSAtIGEubWF4WSA6IGEueCAtIGIueCB9KVxyXG4gICAgICAgICAgICBsZXQgYml0ID0gdHJ1ZSwgY3VycmVudCA9IDFcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IGFjdGl2ZVswXS54OyB4IDw9IGFjdGl2ZVthY3RpdmUubGVuZ3RoIC0gMV0ueDsgeCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYml0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVbY3VycmVudF0ueCA9PT0geClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlW2N1cnJlbnRdLm1heFkgIT09IHkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaXQgPSAhYml0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFyY1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwIC0geC1zdGFydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwIC0geS1zdGFydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIHJhZGl1c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IGFuZ2xlIChyYWRpYW5zKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBhbmdsZSAocmFkaWFucylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgYXJjKHgwLCB5MCwgcmFkaXVzLCBzdGFydCwgZW5kLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguUEkgLyByYWRpdXMgLyA0XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpICs9IGludGVydmFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW01hdGguZmxvb3IoeDAgKyBNYXRoLmNvcyhpKSAqIHJhZGl1cyksIE1hdGguZmxvb3IoeTAgKyBNYXRoLnNpbihpKSAqIHJhZGl1cyldKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZW1wdGllcyBjYWNoZSBvZiBvbGQgc3ByaXRlc1xyXG4gICAgICovXHJcbiAgICBmbHVzaCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdXHJcbiAgICB9XHJcbn1cclxuXHJcblBpeGVsYXRlLl90ZXh0dXJlID0gUElYSS5UZXh0dXJlLldISVRFXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpeGVsYXRlIl19