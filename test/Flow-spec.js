/**
 * Created by We-Smart on 2016/2/27.
 */
describe('Flow', function() {
    var should = chai.should();
    it('check it property', function() {
        var flow = new Flow();
        flow.should.have.property('map').with.a('object');
        flow.should.have.property('setMap').with.a('function');
        flow.should.have.property('run').with.a('function');
    });

});
