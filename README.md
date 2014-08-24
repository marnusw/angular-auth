# AngularJS directive for OAuth 2.0

AngularJS directive for the [OAuth 2.0 Resource Owner Password Credentials Flow](http://tools.ietf.org/html/rfc6749#section-1.3.3).

## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs and test cases in your contribution.

### Setup

* Fork and clone the repository
* Run `npm install && bower install`

### Unit tests (karma)

`npm install && bower install`

* Install [PhantomJS](http://phantomjs.org/download.html) then run `sudo ln -s ~/phantomjs-VERSION/bin/phantomjs /usr/bin/phantomjs`
* `grunt karma:unit`

### Creating your own distribution

* `grunt build`

The new distribution files will be created in the `dist/` folder.

### Feedback

Use the [issue tracker](http://github.com/marnusw/mw-oauth/issues) for bugs and ideas that can improve the project.

### Links

* [GIT Repository](http://github.com/marnusw/mw-oauth)

## Authors

Project created and released as open-source thanks to:

* [Marnus Weststrate](https://github.com/marnusw) - Designed & Developed
* [Andrea Reginato](http://twitter.com/andreareginato) - Reused some code 
  from [oauth-ng](https://github.com/andreareginato/oauth-ng)

## Contributors

Special thanks to all [contributors](https://github.com/marnusw/mw-oauth/contributors)
for submitting patches.

### Coding guidelines

Can easily be picked up from the current code base.

## Changelog

See [CHANGELOG](https://github.com/marnusw/mw-oauth/blob/master/CHANGELOG.md)

## Copyright

Copyright (c) 2014 [Marnus Weststrate](https://github.com/marnusw).
See [LICENSE](https://github.com/marnusw/mw-oauth/blob/master/LICENSE.md) for details.
