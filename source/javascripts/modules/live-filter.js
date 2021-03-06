'use strict';

var angular = require('angular');
var $ = require('jquery');
var each = require('lodash/collection/each');
var map = require('lodash/collection/map');
var filter = require('lodash/collection/filter');
var flatten = require('lodash/array/flatten');

exports.LiveFilter = {
  el: '.ng-live-filter',

  init: function() {
    var app = angular.module('live-filter', []);

    app.factory('countriesFactory', countriesFactory);
    app.factory('industriesFactory', industriesFactory);

    app.controller('LiveFilterCtrl', LiveFilterController);
    app.controller('LiveIndustryFilterCtrl', LiveIndustryFilterController);

    app.directive('countries', countriesDirective);
    app.directive('industries', industriesDirective);

    app.filter('cleanUrl', cleanUrl);

    angular.bootstrap($(this.el), ['live-filter']);
  },

};

/////////////////////////////

function countriesFactory ($http) {
  return function() {
    return $http({
      url: window.BASE_PATH + 'data/countries_by_letter.json'
    });
  };
}

function industriesFactory ($http) {
  return function() {
    return $http({
      url: window.BASE_PATH + 'data/industries_by_letter.json'
    });
  };
}

function LiveFilterController ($scope, countriesFactory) {
  countriesFactory().then(function(res) {
    var countries = res.data;

    $scope.countries = countries;

    $scope.getCount = function () {
      var countries = map($scope.countries, function (v, k) {
        return v;
      });
      return flatten(countries).length;
    };

    $scope.filter = function (query) {
      var filtered = {};
      query = query.toLowerCase() || '';

      each(countries, function (v, k) {
        v = filter(v, function (c) {
          return ~c.toLowerCase().indexOf(query);
        });

        filtered[k] = v;
      });

      $scope.countries = filtered;
    };
  });
}

function LiveIndustryFilterController ($scope, industriesFactory) {
  industriesFactory().then(function(res) {
    var industries = res.data;

    $scope.industries = industries;

    $scope.getCount = function () {
      var industries = map($scope.industries, function (v, k) {
        return v;
      });
      return flatten(industries).length;
    };

    $scope.filter = function (query) {
      var filtered = {};
      query = query.toLowerCase() || '';

      each(industries, function (v, k) {
        v = filter(v, function (c) {
          return ~c.toLowerCase().indexOf(query);
        });

        filtered[k] = v;
      });

      $scope.industries = filtered;
    };
  });
}

function countriesDirective (countriesFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      countries: '=data'
    },
    templateUrl: window.BASE_PATH + 'partials/countries.html'
  };
}

function industriesDirective (industriesFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      countryStub: '@countryStub',
      industries: '=data'
    },
    templateUrl: window.BASE_PATH + 'partials/industries.html'
  };
}

function cleanUrl () {
  return function (input) {
    return input
            .toLowerCase()
            .replace(/\s/g, '-')
            .replace(/[^a-z0-9-]/ig,'');
  };
}
