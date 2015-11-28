'use strict';

describe('Linked List', function () {
    var LinkedList,
        startingList,
        doubleList;

    beforeEach(module('bm.uiTour', 'test.templates'));
    beforeEach(inject(function (_LinkedList_) {
        LinkedList = _LinkedList_;

        startingList = LinkedList.create();
        startingList.push('Hello');
        startingList.push('World');

        doubleList = LinkedList.create(true);
        doubleList.push('Hello');
        doubleList.push('World');
    }));

    it('should return an array', function () {
        //given
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['Hello', 'World']);
        expect(dub).toEqual(['Hello', 'World']);
    });

    it('should push to the end of the list', function () {
        //when
        startingList.push('Foo');
        doubleList.push('Foo');
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['Hello', 'World', 'Foo']);
        expect(dub).toEqual(['Hello', 'World', 'Foo']);
    });

    it('should push to the beginning of the list', function () {
        //when
        startingList.unshift('Foo');
        doubleList.unshift('Foo');
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['Foo', 'Hello', 'World']);
        expect(dub).toEqual(['Foo', 'Hello', 'World']);
    });

    it('should pop from the end of the list', function () {
        //when
        startingList.pop();
        doubleList.pop();
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['Hello']);
        expect(dub).toEqual(['Hello']);
    });

    it('should pop from the beginning of the list', function () {
        //when
        startingList.shift();
        doubleList.shift();
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['World']);
        expect(dub).toEqual(['World']);
    });

    it('should insert into middle of list', function () {
        //when
        startingList.insertAt(1, 'Foo');
        doubleList.insertAt(1, 'Foo');
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['Hello', 'Foo', 'World']);
        expect(dub).toEqual(['Hello', 'Foo', 'World']);
    });

    it('should remove from beginning of list', function () {
        //when
        startingList.remove('Hello');
        doubleList.remove('Hello');
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['World']);
        expect(dub).toEqual(['World']);
    });

    it('should remove from end of list', function () {
        //when
        startingList.remove('World');
        doubleList.remove('World');
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['Hello']);
        expect(dub).toEqual(['Hello']);
    });

    it('should remove from middle of list', function () {
        //when
        startingList.insertAt(1, 'Foo');
        doubleList.insertAt(1, 'Foo');
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual(['Hello', 'Foo', 'World']);
        expect(dub).toEqual(['Hello', 'Foo', 'World']);

        //when
        startingList.remove('Foo');
        doubleList.remove('Foo');
        var arr2 = startingList.toArray();
        var dub2 = doubleList.toArray();

        //then
        expect(arr2).toEqual(['Hello', 'World']);
        expect(dub2).toEqual(['Hello', 'World']);
    });

    it('should remove the only element', function () {
        //when
        startingList.pop();
        startingList.remove('Hello');
        doubleList.shift();
        doubleList.remove('World');
        var arr = startingList.toArray();
        var dub = doubleList.toArray();

        //then
        expect(arr).toEqual([]);
        expect(dub).toEqual([]);
    });

    it('should find an existing element, shouldnt find non-exising element', function () {
        expect(startingList.contains('Hello')).toBe(true);
        expect(doubleList.contains('Hello')).toBe(true);
        expect(startingList.contains('Blah')).toBe(false);
        expect(doubleList.contains('Blah')).toBe(false);
    });

});
