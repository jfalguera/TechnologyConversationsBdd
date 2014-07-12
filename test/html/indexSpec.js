describe('storiesModule controllers', function() {
    var scope, http, modal, modalInstance, location;

    beforeEach(module('storiesModule'));

    beforeEach(
        inject(function($injector) {
            http = $injector.get('$http');
            location = $injector.get('$location');
            scope = {};
        })
    );

    describe('TcBddService service', function() {

        var service, modal;

        beforeEach(
            inject(function(TcBddService, $modal) {
                service = TcBddService;
                modal = $modal;
            })
        );

        describe('openCompositeClass function', function() {
            var text = 'this is some random text';
            it('should call $modal.open with templateUrl compositeClasses.tmpl.html', function() {
                spyOn(modal, 'open');
                service.openCompositeClass(text);
                expect(modal.open).toHaveBeenCalled();
            });

        });

        describe('removeCollectionElement function', function() {
            it('should remove element on specified index', function() {
                var collection = [{item: 0}, {item: 1}, {item: 2}];
                service.removeCollectionElement(collection, 1);
                expect(collection.length).toEqual(2);
                expect(collection[1]).toEqual({item: 2});
            });
        });

        describe('buttonCssClass function', function() {
            var scope, form;
            beforeEach(
                inject(function ($rootScope, $compile) {
                    scope = $rootScope.$new();
                    form = $compile('<form>')(scope);
                })
            );
            it('should return success if form is valid', function() {
                form.$invalid = false;
                form.$valid = true;
                expect(service.buttonCssClass(form)).toEqual({'btn-success': true, 'btn-danger': false});
            });
            it('should return danger if form is valid', function() {
                form.$invalid = true;
                form.$valid = false;
                expect(service.buttonCssClass(form)).toEqual({'btn-success': false, 'btn-danger': true});
            });
        });

    });

    describe('modalCtrl controller', function() {

        var modalInstance;
        var data = {status: 'OK'};
        beforeEach(
            inject(function($controller) {
                $controller("modalCtrl", {$scope: scope , $modalInstance: modalInstance, data: data});
            })
        );

        it('should put data to the scope', function() {
            expect(scope.data).toBe(data);
        });

    });

    describe('storiesCtrl controller', function() {

        var httpBackend;
        var filesWithoutPath = {status: 'OK', files: 'filesWithoutPath'};

        beforeEach(
            inject(function($controller, $httpBackend) {
                $controller('storiesCtrl', {
                    $scope: scope,
                    $http: http,
                    $modal: modal,
                    $modalInstance: modalInstance,
                    $location: location
                });
                httpBackend = $httpBackend;
                httpBackend.expectGET('/stories/list.json?path=').respond(filesWithoutPath);
            })
        );

        describe('getStories function', function() {
            it('should be called by the controller with the empty path', function() {
                expect(scope.files).toBeUndefined();
                httpBackend.flush();
                expect(scope.files).toEqual(filesWithoutPath);
            });
        });

        describe('allowToPrevDir function', function() {
            it('should return true when rootPath is NOT an empty string', function() {
                scope.rootPath = 'this/is/path';
                expect(scope.allowToPrevDir()).toEqual(true);
            });
            it('should return false when rootPath is an empty string', function() {
                scope.rootPath = '';
                expect(scope.allowToPrevDir()).toEqual(false);
            });
        });

    });

});

describe("common functions", function() {

    describe('classNamePattern validates that values is a valid Java class name', function() {
        it('should NOT start with a number', function() {
            expect('1abc').not.toMatch(classNamePattern());
        });
        it('should use any combination of letters, digits, underscores and dollar signs', function() {
            expect('aBc').toMatch(classNamePattern());
            expect('a123').toMatch(classNamePattern());
            expect('_a').toMatch(classNamePattern());
            expect('$a').toMatch(classNamePattern());
            expect('aBc_D$23').toMatch(classNamePattern());
        });
        it('should NOT use any character other than letters, digits, underscores and dollar signs', function() {
            expect('abc%').not.toMatch(classNamePattern());
            expect('ab c').not.toMatch(classNamePattern());
        });
    });

    describe('getViewStoryUrl function', function() {
       it('should return /page/stories/view/', function() {
           expect(getViewStoryUrl()).toEqual('/page/stories/view/');
       });
    });

    describe('getNewStoryUrl function', function() {
        it('should return /page/stories/new/', function() {
            expect(getNewStoryUrl()).toEqual('/page/stories/new/');
        });
    });

    describe('getCompositesUrl function', function() {
        it('should return /page/composites/', function() {
            expect(getCompositesUrl()).toEqual('/page/composites/');
        });
    });

});