# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.18.0](https://github.com/daybrush/selecto/compare/1.17.0...1.18.0) (2022-08-02)
### :sparkles: Packages
* `lit-selecto` 1.18.0
* `preact-selecto` 1.15.0
* `react-selecto` 1.18.0
* `selecto` 1.18.0
* `svelte-selecto` 1.18.0
* `vue-selecto` 1.18.0
* `vue3-selecto` 1.4.0
* `ngx-selecto` 1.18.0


### :rocket: New Features

* `selecto`
    * add preventRightClick #90 ([b68f33a](https://github.com/daybrush/selecto/commit/b68f33a7b420447f37a326be602c37792cca1114))
    * prevent click bubbling #89 ([6538396](https://github.com/daybrush/selecto/commit/653839665580bfac43531d5c089713fc240146ee))
    * support ref, function, string scroll container type #86 ([8202e07](https://github.com/daybrush/selecto/commit/8202e0701dc1668eef1028747065b07925f8efad))


### :bug: Bug Fix

* `ngx-selecto`
    * fix angular type consts ([d6496bf](https://github.com/daybrush/selecto/commit/d6496bf6ebb4d3f804b823a4ba2081fb4abafcaf))


### :house: Code Refactoring

* All
    * apply lerna ([59dc0c9](https://github.com/daybrush/selecto/commit/59dc0c934a20f3999a2480df192f507f4d5a3b2c))


### :mega: Other

* `vue3-selecto`, `vue-selecto`, `svelte-selecto`, `react-selecto`, `preact-selecto`, `ngx-selecto`, `lit-selecto`
    * publish packages ([a659fca](https://github.com/daybrush/selecto/commit/a659fcac851c216036b7231072c2d155ff7987f1))
* `selecto`
    * update gesto ([30575a1](https://github.com/daybrush/selecto/commit/30575a154fca8a95a8d4784583243e09d900dc70))
* Other
    * Add FUNDING ([dcc77f7](https://github.com/daybrush/selecto/commit/dcc77f77d9e50718801ccdac637a2ae7cbe5d35c))
    * Release 1.17.0 ([a27bec4](https://github.com/daybrush/selecto/commit/a27bec4ade24197962be261d57c5cda98b1377af))



# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).


## [1.17.0] - 2022-07-04
* `selecto` 1.17.0
* `react-selecto` 1.17.0
* `preact-selecto` 1.17.0
* `ngx-selecto` 1.17.0
* `svelte-selecto` 1.17.0
* `vue-selecto` 1.17.0
* `vue3-selecto` 1.17.0
* `lit-selecto` 1.17.0

### Added
* Add `toggleContinueSelectWithoutDeselect` prop #80

### Fixed
* enhance large amount of data #81
* fix vue methods #79
* fix elementFromPoint in jest #83
* fix meta key in firefox #82
* fix vue container #64

## [1.13.2] - 2021-11-24
* `selecto` 1.13.2
* `react-selecto` 1.13.2
* `preact-selecto` 1.13.2
* `ngx-selecto` 1.13.1
* `svelte-selecto` 1.13.3
* `vue-selecto` 1.13.3
* `lit-selecto` 1.13.2

### Fixed
* fix `stop()` property on drag event #60


## [1.13.1] - 2021-11-23
* `selecto` 1.13.1
* `react-selecto` 1.13.1
* `preact-selecto` 1.13.1
* `ngx-selecto` 1.13.0
* `svelte-selecto` 1.13.2
* `vue-selecto` 1.13.2
* `lit-selecto` 1.13.1

### Fixed
* Fix vue types #59
* Support `stop()` property on drag event #60
* Support svelte SSR



## [1.13.0] - 2021-09-11
* `selecto` 1.13.0
* `react-selecto` 1.13.0
* `preact-selecto` 1.13.0
* `ngx-selecto` 1.13.0
* `svelte-selecto` 1.13.0
* `lit-selecto` 1.13.0

### Added
* Add `isClick` property on dragEnd, selectEnd #51

### Fixed
* Fix svelte ssr #53
* Fix boundContainer's area on scroll #52


## [1.12.1] - 2021-06-17
* `selecto` 1.12.1
* `react-selecto` 1.12.0
* `preact-selecto` 1.12.0
* `ngx-selecto` 1.12.0
* `svelte-selecto` 1.12.0
* `lit-selecto` 1.12.0

### Added
* Add `dragCondition` option #47 
* Add `rootContainer` option #49 


## [1.11.0] - 2021-03-21
* `selecto` 1.11.0
* `react-selecto` 1.11.0
* `preact-selecto` 1.10.0
* `ngx-selecto` 1.11.0
* `svelte-selecto` 1.11.0
* `lit-selecto` 1.11.0

### Added
* Add `getSelectableElements` method #37

## [1.10.2] - 2020-12-22
* `selecto` 1.10.2
* `react-selecto` 1.10.2
* `preact-selecto` 1.9.2
* `ngx-selecto` 1.10.2
* `svelte-selecto` 1.10.2
* `lit-selecto` 1.10.2

### Added
* Fix `getElementRect` option #28


## [1.10.1] - 2020-11-15
* `selecto` 1.10.1
* `react-selecto` 1.10.1
* `preact-selecto` 1.9.1
* `ngx-selecto` 1.10.1
* `svelte-selecto` 1.10.1
* `lit-selecto` 1.10.1

### Added
* Add `preventDragFromInside` option #27

## [1.9.2] - 2020-11-10
* `selecto` 1.9.2
* `react-selecto` 1.9.2
* `preact-selecto` 1.8.2
* `ngx-selecto` 1.9.2
* `svelte-selecto` 1.9.2
* `lit-selecto` 1.9.2

### Fixed
* Fix clickTarget method #25

## [1.9.1] - 2020-11-08
* `selecto` 1.9.1
* `react-selecto` 1.9.1
* `preact-selecto` 1.8.1
* `ngx-selecto` 1.9.1
* `svelte-selecto` 1.9.1
* `lit-selecto` 1.9.2

### Added
* Add `getElementRect` option #12
* Add `isSelect` property on events
* Add `getSelectedTargets`, `getElementPoints` methods

### Fixed
* Fix importing problem #26
* Fix isDouble is not working #25
