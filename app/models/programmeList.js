var request = require('request');
var IMAGE_SMALL = '192x108';
var IMAGE_MEDIUM = '406x228';
var IMAGE_LARGE = '560x315';

exports.callToApi = function (letter) {
  var base = 'https://ibl.api.bbci.co.uk/ibl/v1/atoz/';
  var page = 1;

  var options = {
    url: base + letter + '/programmes?page=' + page,
    headers: {
      'User-Agent': 'request'
    }
  }

  return new Promise(function (resolve, reject) {
    request.get(options, function (error, response, body) {
      if (error) return reject(error);
      if (response.statusCode !== 200) return reject(new Error(body));
      if (!error && response.statusCode === 200) {
        var programmes = _handleResponse(JSON.parse(body));


        console.log('SOME FUNCTION I DONT KNOW ABOUT DONE, RESOLVING PROMISE', programmes);


        resolve(programmes);
      }

      console.log('END OF CALLBACK')
    });
  });
}

function _handleResponse(data) {
  //data that will be useful with pagination:
  var numPerPage = data.atoz_programmes.per_page;
  var numOfProgrammes = data.atoz_programmes.count;
  var currentPage = data.atoz_programmes.page;

  return data.atoz_programmes.elements.map(function (programme) {
    return _parseProgrammeData(programme);
  });
}

function _parseProgrammeData(programme) {
  var title = programme.title;
  var imageUrlWithRecipe = programme.images.standard;
  var imageUrl = imageUrlWithRecipe.replace('{recipe}', IMAGE_SMALL);
  return { title: title, image: imageUrl };
}
