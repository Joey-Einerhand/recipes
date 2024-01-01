/// Search.js was taken from https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/
// and modified to fit the new LUNR code. The only edit for this was the change to index building and custom html elements
// https://lunrjs.com/guides/upgrading.html

(function() {
    function displaySearchResults(results, store) {
      var searchResults = document.getElementById('search-results');
      console.log(results)
      if (results.length) { // Are there any results?
        var appendString = '';
        for (var i = 0; i < results.length; i++) {  // Iterate over the results
          var item = store[results[i].ref];
          let decodedCategories = item.categories.replace(/&quot;/g, '"');
          let categoryArray = JSON.parse(decodedCategories);
          appendString += '<div class="col-md-3 recipe-post col col-12 justify-content-top">';
          appendString += '  <a href="' + item.url + ' class="col-12"">';
          appendString += '      <img src="' + item.image + '" alt="' + item.title + '" class="thumbnail rounded">';
          appendString += '  </a>';
          appendString += '  <div class="col-12">';
          appendString += '      <h2 class="mb-0"><a href="' + item.url + '">' + item.title + '</a></h2>';
          appendString += '  </div>';
          appendString += '  <div class="categories-list col-12">';
          if (categoryArray.length > 1) {
          for (let category of categoryArray) {
              appendString += '      <a class="categories" href="'+ item.baseurl +'/categories/' + category.toLowerCase() + '">' + category  + '</a>';
              if (category != categoryArray[categoryArray.length - 1]) {
                appendString += '      • ';
              }
            }
          }
          appendString += '  </div>';
          appendString += '<div class="row timer col-12">';
          if (item.preptime) {
        
          appendString += '       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill col-auto" viewBox="0 0 16 16">';
          appendString += '           <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>';
          appendString += '       </svg>';
          appendString += '       <p class="col-auto">';
          appendString += '            ' + item.preptime;
          appendString += '       </p>';
          }
          appendString += '</div>';
          appendString += '</div>';
  
          searchResults.innerHTML = appendString;
        }
      } else {
        searchResults.innerHTML = '<p>No results found</p>';
      }
    }
  
    function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
  
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
  
        if (pair[0] === variable) {
          return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
        }
      }
    }
  
    var searchTerm = getQueryVariable('query');
  
    if (searchTerm) {
      document.getElementById('search-box').setAttribute("value", searchTerm);
      document.getElementById('page-title').textContent = "Searched for: \"" + searchTerm + "\"";
      /// The following part was updated from the original blogpost
      // Initalize lunr with the fields it will be searching on. I've given title
      // a boost of 10 to indicate matches on this field are more important.
      var idx = lunr(function () {
        this.field('id');
        this.field('title', { boost: 10 });
        this.field('author');
        this.field('category');
        this.field('content');
        for (var key in window.store) { // Add the data to lunr
            this.add({
              'id': key,
              'title': window.store[key].title,
              'author': window.store[key].author,
              'categories': window.store[key].categories,
              'content': window.store[key].content,
              'image': window.store[key].image,
              'preptime': window.store[key].preptime,
              'baseurl': window.store[key].baseurl
            });
        }
      });
      for (var key in window.store) { // Add the data to lunr
        var results = idx.search(searchTerm); // Get lunr to perform a search
        displaySearchResults(results, window.store); // We'll write this in the next section
      }
    }
    else {
      var searchResults = document.getElementById('search-results');
      searchResults.innerHTML = '<p>No results found</p>';
      document.getElementById('page-title').textContent = "Searched for: Nothing!";
    }

  })();
  