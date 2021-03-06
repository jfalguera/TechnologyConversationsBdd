describe('compositesModule', function() {

    beforeEach(module('ngCookies', 'compositesModule', 'storiesModule'));

    describe('compositesCtrl controller', function() {

        var scope, form, httpBackend, modal, location, cookieStore, composite, anotherComposite;
        var service;
        var newComposite = {stepText: 'Given some other precondition', compositeSteps :[{step: 'When action'},{step: 'Then result'}]};
        var className = 'WebStepsComposites';
        var newClassName = 'OtherStepsComposites';
        var compositesClass;
        var newCompositesClass;
        var steps = {"steps":[{"type":"GIVEN","step":"Given Web address $url is opened"}]};
        var emptyComposite = {stepText: '', compositeSteps: [{}]};
        var compositeStepText = 'Given this is my composites step';
        var stepTextParam = 'Given URL params have stepText';

        beforeEach(
            inject(function($controller, $injector, $rootScope, $http, $httpBackend, $compile, $location, $cookieStore, TcBddService) {
                service = TcBddService;
                scope = $rootScope.$new();
                location = $location;
                cookieStore = $cookieStore;
                composite = {
                    stepText: 'Given precondition',
                    compositeSteps :[{step: 'When action'},{step: 'Then result'}]
                };
                newCompositesClass = {
                    class: newClassName,
                    composites: [composite]
                };
                anotherComposite = {stepText: 'When action', compositeSteps :[{step: 'Then result'}]};
                compositesClass = {
                    class: className,
                    composites: [composite, anotherComposite],
                    isNew: false
                };
                $controller('compositesCtrl', {
                    $scope: scope,
                    $http: $http,
                    $modal: modal,
                    $location: location,
                    compositesClass: compositesClass,
                    compositeStepText: compositeStepText,
                    steps: steps
                });
                httpBackend = $httpBackend;
                form = $compile('<form>')(scope);
                form.$invalid = false;
                form.$valid = true;
            })
        );

        describe('by default', function() {
            it('should default composite to the last element of compositesClass.composites', function() {
                var expected = scope.compositesClass.composites[scope.compositesClass.composites.length - 1];
                expect(scope.composite).toEqual(expected);
            });
            it('should put compositesClass to the scope variable compositesClass', function () {
                expect(scope.compositesClass).toEqual(compositesClass);
            });
            it('should put compositesClass to the scope variable originalCompositesClass', function () {
                expect(scope.originalCompositesClass).toEqual(compositesClass);
            });
            it('should put steps to the scope variable steps', function () {
                expect(scope.steps).toEqual(steps);
            });
            it('should return common function from classNamePattern', function() {
                expect(scope.classNamePattern().toString()).toBe(service.classNamePattern().toString());
            });
        });

        describe('setLastComposite function', function() {
            it('should default composite to the last element of compositesClass.composites', function() {
                var stepText = 'Given this is something different';
                scope.compositesClass.composites.push({stepText: stepText});
                scope.setLastComposite();
                expect(scope.composite.stepText).toEqual(stepText);
            });
        });

        describe('buttonCssClass', function() {
            it('should use service function buttonCssClass', function() {
                expect(scope.buttonCssClass(form, form)).toEqual(service.buttonCssClass(form));
            });
        });

        describe('openComposite', function() {
            it('should set value to the scope variable composite', function() {
                scope.openComposite(composite);
                expect(scope.composite).toBe(composite);
            });
        });

        describe('stepTextPattern function', function() {
            it('should use util function', function() {
                expect(scope.stepTextPattern()).toEqual(service.stepTextPattern());
            });
        });

        describe('addNewComposite function ', function() {
            it('should reset the composite to {}', function() {
                scope.composite = {status: 'dirty'};
                scope.addNewComposite();
                expect(scope.composite).toEqual(emptyComposite);
            });
            it('should add new composite to compositesClass collection', function() {
                var expected = scope.compositesClass.composites.length + 1;
                scope.addNewComposite();
                var length = scope.compositesClass.composites.length;
                expect(length).toEqual(expected);
                var newComposite = scope.compositesClass.composites[length - 1];
                expect(newComposite).toEqual(emptyComposite);
            });
        });

        describe('addStepTextParam function', function() {
            it('should add query param stepText to compositeClass.composites', function(){
                location.search('stepText', stepTextParam);
                scope.addStepTextParam();
                var actual = scope.compositesClass.composites[scope.compositesClass.composites.length - 1].stepText;
                expect(actual).toEqual(stepTextParam);
            });
            it('should add query param stepText to composite', function(){
                location.search('stepText', stepTextParam);
                scope.addStepTextParam();
                scope.setLastComposite();
                var actual = scope.composite.stepText;
                expect(actual).toEqual(stepTextParam);
            });
        });

        describe('addNewCompositeStep function', function() {
            it('should add empty element to composite.compositeSteps', function() {
                var expected = scope.composite.compositeSteps.length + 1;
                scope.addNewCompositeStep();
                var length = scope.composite.compositeSteps.length;
                expect(length).toEqual(expected);
                var newStep = scope.composite.compositeSteps[length - 1];
                expect(newStep).toEqual({});
            });
        });

        describe('newCollectionItem function', function() {
            it('should use newCollectionItem service function', function() {
                expect(scope.newCollectionItem).toBe(service.newCollectionItem);
            });
        });

        describe('removeCollectionElement function', function() {
            it('should use util removeCollectionElement function', function() {
                expect(scope.removeCollectionElement).toBe(service.removeCollectionElement);
            });
        });

        describe('revertCompositesClass function', function() {
            it('should revert compositesClass to originalCompositesClass', function() {
                scope.compositesClass = newCompositesClass;
                scope.revertCompositesClass();
                expect(scope.compositesClass).toEqual(scope.originalCompositesClass);
            });
            it('should revert composite to {}', function() {
                scope.composite = newComposite;
                scope.revertCompositesClass();
                expect(scope.composite).toEqual(scope.compositesClass.composites[0]);
            });
        });

        describe('canRevertCompositesClass function', function() {
            it('should return false when both compositesClass and originalCompositesClass are the same', function() {
                expect(scope.canRevertCompositesClass()).toEqual(false);
            });
            it('should return true when compositesClass are different than originalCompositesClass', function() {
                scope.compositesClass = newCompositesClass;
                expect(scope.canRevertCompositesClass()).toEqual(true);
            });
        });

        describe('canSaveCompositesClass function', function() {
            it('should return false if form is invalid', function() {
                form.$invalid = true;
                form.$valid = false;
                expect(scope.canSaveCompositesClass(form)).toEqual(false);
            });
            it('should return false if data did NOT change', function() {
                form.$invalid = false;
                form.$valid = true;
                expect(scope.canSaveCompositesClass(form)).toEqual(false);
            });
            it('should return true if it is new and valid', function() {
                scope.compositesClass.isNew = true;
                expect(scope.canSaveCompositesClass(form)).toEqual(true);
            });
            it('should return true if form is valid and data did change', function() {
                form.$invalid = false;
                form.$valid = true;
                scope.compositesClass = newCompositesClass;
                expect(scope.canSaveCompositesClass(form)).toEqual(true);
            });
        });

        describe('compositesAreValid function', function() {
            it('should return false when composite steps are not defined', function() {
                scope.compositesClass.composites.push({stepText: 'Given something'});
                expect(scope.compositesAreValid(form)).toEqual(false);
            });
            it('should return false when form is invalid', function() {
                form.$valid = false;
                form.$invalid = true;
                expect(scope.compositesAreValid(form)).toEqual(false);
            });
            it('should return false composite ', function() {
                scope.compositesClass.composites[0].stepText = '';
                expect(scope.compositesAreValid(form)).toEqual(false);
            });
            it('should return false when there are no composite steps', function() {
                scope.compositesClass.composites.push({stepText: 'Given something', compositeSteps: []});
                expect(scope.compositesAreValid(form)).toEqual(false);
            });
            it('should return true if all other conditions are fulfilled', function() {
                scope.compositesClass.composites.push({stepText: 'Given something', compositeSteps: [{steps: 'When something else'}]});
                expect(scope.compositesAreValid(form)).toEqual(true);
            });
        });

        describe('saveCompositesClass function', function() {
            it('should send PUT request to /groovyComposites', function() {
                httpBackend.expectPUT('/groovyComposites').respond();
                scope.saveCompositesClass();
                httpBackend.flush();
            });
            it('should put compositesClass to the scope variable originalCompositesClass when response is successful', function () {
                scope.compositesClass.composites.push(newComposite);
                httpBackend.expectPUT('/groovyComposites').respond();
                scope.saveCompositesClass();
                httpBackend.flush();
                expect(scope.originalCompositesClass).toEqual(scope.compositesClass);
            });
            it('should set compositesClass.isNew to false', function() {
                httpBackend.expectPUT('/groovyComposites').respond();
                scope.saveCompositesClass();
                httpBackend.flush();
                expect(scope.compositesClass.isNew).toEqual(false);
            });
            it('should call service function openErrorModal when response is NOT successful', function() {
                var response = {any: 'json'};
                spyOn(service, 'openErrorModal');
                httpBackend.expectPUT('/groovyComposites').respond(400, response);
                scope.saveCompositesClass();
                httpBackend.flush();
                expect(service.openErrorModal).toHaveBeenCalledWith(response);
            });
            it('should change location if class changed', function() {
                httpBackend.expectPUT('/groovyComposites').respond();
                httpBackend.expectDELETE('/groovyComposites/' + className).respond();
                scope.compositesClass.class = newClassName;
                scope.saveCompositesClass();
                httpBackend.flush();
                expect(location.path()).toEqual('/page/composites/' + newClassName + '.groovy');
            });
            it('should make DELETE request to /groovyComposites/CLASS_NAME when class change', function() {
                httpBackend.expectPUT('/groovyComposites').respond();
                httpBackend.expectDELETE('/groovyComposites/' + className).respond();
                scope.compositesClass.class = newClassName;
                scope.originalCompositesClass.class = className;
                scope.saveCompositesClass();
                httpBackend.flush();
            });
            it('should save composite class name as a cookie', function() {
                httpBackend.expectPUT('/groovyComposites').respond();
                scope.saveCompositesClass();
                httpBackend.flush();
                expect(cookieStore.get("compositeClass")).toEqual(className);
            });
        });

        describe('canDeleteCompositesClass function', function() {
            it('should return false when compositesClass.isNew equals true', function() {
                scope.compositesClass.isNew = true;
                expect(scope.canDeleteCompositesClass()).toEqual(false);
            });
        });

        describe('saveCompositesText function', function() {
            it('should return Create New Composites when composites class does not exist', function() {
                scope.compositesClass.isNew = true;
                expect(scope.saveCompositesText()).toEqual('Create New Composites');
            });
            it('should return Update Composites when composites class exists', function() {
                scope.compositesClass.isNew = false;
                expect(scope.saveCompositesText()).toEqual('Update Composites');
            });
        });

    });

});