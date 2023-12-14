const expect = require('chai').expect;

const { Refs, Collection } = require('../..');


describe('refs', function() {

  it('should export members', function() {
    expect(Refs).to.exist;
    expect(Collection).to.exist;

    expect(Collection.isExtended).to.exist;
    expect(Collection.extend).to.exist;
  });

});