describe('Programme Listings', function () {
  var mock = require('protractor-http-mock');

  beforeEach(function () {
    mock([{
      request: {
        path: '/api/programmes/a',
        method: 'GET',
        queryString: { page:  '1' }
      },
      response: {
        data: {
          numOfPages: 2,
          programmes: [
              { title: 'Abadas', image: 'http://abadas.jpg/' },
              { title: 'ABBA', image: 'http://abba.jpg/' }
            ]
        }
      }
    }]);

    browser.get('/');
    var letterA = $$('#a-to-z li').first();
    letterA.click();
  });

  afterEach(function () {
    mock.teardown();
  });

  it('has links from A to Z', function () {
    var aToZ = $$('#a-to-z li');

    expect(aToZ.count()).toEqual(26);
    expect(aToZ.first().getText()).toEqual('A');
    expect(aToZ.last().getText()).toEqual('Z');
  });

  it('fetches a list of programmes and displays page count', function () {
    var programmes = $$('#programmes li p');
    var programmeImages = $$('#programmes li img');
    var pageCount = $$('#page-count li');

    expect(pageCount.first().getText()).toEqual('1');
    expect(pageCount.last().getText()).toEqual('2');
    expect(programmes.first().getText()).toEqual('Abadas');
    expect(programmes.last().getText()).toEqual('ABBA');
    expect(programmeImages.first().getAttribute('src')).toEqual('http://abadas.jpg/');
    expect(programmeImages.last().getAttribute('src')).toEqual('http://abba.jpg/');
  });

  it('refreshes the list when user clickes on another page', function () {
    mock.add([{
      request: {
        path: '/api/programmes/a',
        method: 'GET',
        queryString: { page:  '2' }
      },
      response: {
        data: {
          numOfPages: 2,
          programmes: [
              { title: 'All Over the Place', image: 'http://all-over-the-place.jpg/' }
            ]
        }
      }
    }]);

    var page2 = $$('#page-count li').last();
    page2.click();
    var programmes = $$('#programmes li p');
    var programmeImages = $$('#programmes li img');

    expect(programmes.first().getText()).not.toEqual('Abadas');
    expect(programmes.first().getText()).toEqual('All Over the Place');
    expect(programmeImages.first().getAttribute('src')).toEqual('http://all-over-the-place.jpg/');
  });
});
