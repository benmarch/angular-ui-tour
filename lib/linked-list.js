(function (app) {
    'use strict';

    app.factory('LinkedList', [function () {

        var LinkedList = {};

        LinkedList.create = function (isDouble) {
            var head = null,
                tail = null,
                length = 0;

            function createNode(data) {
                var node = {
                    data: data,
                    next: null
                };

                if (isDouble) {
                    node.prev = null;
                }

                return node;
            }

            return {
                getHead: function () {
                    return head;
                },
                getTail: function () {
                    return tail;
                },
                size: function () {
                    return length;
                },
                push: function (data) {
                    var newNode = createNode(data);
                    if (tail) {
                        tail.next = newNode;
                        if (isDouble) {
                            newNode.prev = tail;
                        }
                        tail = newNode;
                    } else {
                        head = tail = newNode;
                    }
                    length += 1;
                    return true;
                },
                pop: function () {
                    if (!head) return;

                    //only 1 item
                    if (!head.next) {
                        head = null;

                        length -= 1;
                        return true;
                    }

                    var current = head;

                    do {
                        if (current.next.next) {
                            current = current.next;
                        } else {
                            current.next = null;
                            tail = current;

                            length -= 1;
                            return true;
                        }
                    } while (current.next);
                },
                unshift: function (data) {
                    var newNode = createNode(data);
                    if (head) {
                        newNode.next = head;
                        if (isDouble) {
                            head.prev = newNode;
                        }
                        head = newNode;
                    } else {
                        head = tail = newNode;
                    }
                    length += 1;
                    return true;
                },
                shift: function () {
                    if (!head) return;

                    if (!head.next) {
                        head = tail = null;
                    } else {
                        if (isDouble) {
                            head.next.prev = null;
                        }
                        head = head.next;
                    }

                    length -= 1;
                    return true;
                },
                insertAt: function (index, data) {
                    if (index === 0 || length === 0) {
                        return this.unshift(data);
                    }
                    if (index >= length) {
                        return this.push(data);
                    }

                    var nodeBefore = head,
                        newNode = createNode(data);
                    for (var i = 1; i < index; ++i) {
                        nodeBefore = nodeBefore.next;
                    }
                    if (isDouble) {
                        if (nodeBefore.next) {
                            nodeBefore.next.prev = newNode;
                        }
                        newNode.prev = nodeBefore;
                    }
                    newNode.next = nodeBefore.next;
                    nodeBefore.next = newNode;

                    length += 1;
                    return true;
                },
                forEach: function (iterator) {
                    var index = 0,
                        current = head,
                        stopped = false;

                    while (current && !stopped) {
                        iterator(current, index, function () { stopped = true; });
                        index += 1;
                        current = current.next;
                    }
                },
                remove: function (data) {
                    if (!head) return false;
                    var current = head;

                    //if first element
                    if (head.data === data) {
                        return this.shift();
                    }

                    while (current.next) {
                        if (current.next.data === data) {
                            //if last item
                            if (current.next === tail) {
                                return this.pop();
                            }

                            if (isDouble) {
                                current.next.next.prev = current;
                            }
                            current.next = current.next.next;

                            length -= 1;
                            return true;
                        }
                        current = current.next;
                    }

                    return false;
                },
                get: function (data) {
                    var current = head;

                    while (current) {
                        if (current.data === data) {
                            return current;
                        }
                        current = current.next;
                    }

                    return null;
                },
                contains: function (data) {
                    var match = false;
                    this.forEach(function (node) {
                        if (node.data === data) {
                            match = true;
                        }
                    });
                    return match;
                }

            }
        };

        return LinkedList;

    }]);

}(angular.module('bm.uiTour')));
