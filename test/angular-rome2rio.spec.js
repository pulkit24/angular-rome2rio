describe('Testing angular-rome2rio provider', function() {
	'use strict';

	var rome2rioProvider, $httpBackend;

	beforeEach(function() {
		// Initialize the service provider
		// by injecting it to a fake module's config block
		var fakeModule = angular.module('test-module', []);
		fakeModule.config(function(_rome2rioProvider_) {
			rome2rioProvider = _rome2rioProvider_;
		});
		// Initialize test-module injector
		module('angular-rome2rio', 'test-module');

		// Kickstart the injectors previously registered
		// with calls to angular.mock.module
		inject(function($injector) {
			$httpBackend = $injector.get('$httpBackend');
		});
	});

	describe('Search API', function() {
		it('should convert a lat-lng pair to a Position', function() {
			expect(rome2rioProvider).not.toBeUndefined();
			expect(rome2rioProvider.$get().toPosition('1', '2')).toBe('1,2');
		});

		it('should configure settings', function() {
			rome2rioProvider.setKey('mykey');
			rome2rioProvider.setServer('free.rome2rio.com');
			rome2rioProvider.setResponseFormat('json');
			rome2rioProvider.setAPIVersion('1.2');
			rome2rioProvider.setCurrency('AUD');
			rome2rioProvider.setDetailLevel('street_address');
			expect(rome2rioProvider.$get().rawRequestURL('orig', 'dest', '1,2', '3,4', 'street_address',
				'street_address', 'AUD')).toBe(
				'http://free.rome2rio.com/api/1.2/json/Search?key=mykey&oName=orig&dName=dest&oPos=1,2&dPos=3,4&oKind=street_address&dKind=street_address&currency=AUD'
			);
		});

		it('should do a search', inject(function($q, $http) {
			rome2rioProvider.setKey('mykey');
			rome2rioProvider.setServer('free.rome2rio.com');
			rome2rioProvider.setResponseFormat('json');
			rome2rioProvider.setAPIVersion('1.2');
			rome2rioProvider.setCurrency('AUD');
			rome2rioProvider.setDetailLevel('street_address');

			var requestURL = rome2rioProvider.$get().rawRequestURL('orig', 'dest', '1,2', '3,4',
				'street_address', 'street_address', 'AUD');

			$httpBackend.expectGET(requestURL).respond({
				routes: [{
					segments: [{
						indicativePrice: 10
						, path: 'path1'
					}, {
						indicativePrice: 20
						, path: 'path2'
					}]
				}]
			});
			var promise = rome2rioProvider.$get($q, $http).search('orig', 'dest', '1,2', '3,4');
			$httpBackend.flush();
			promise.then(function(routes) {
				expect(routes.getCost()).toBe(30);
				expect(routes.getPaths()).toBe(['path1', 'path2']);
			});
		}));
	});

});
