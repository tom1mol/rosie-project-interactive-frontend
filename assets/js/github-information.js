function userInformationHTML(user) {    //return html code we use to render the data for our users //single parameter..user(our object)
    return `                                
        <h2>${user.name}                    <!-- url that will link to a users github page target=_blank...opens up in new tab-->
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)  
            </span>                                                             
        </h2>
        <div class ="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url} target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />"    <!--shows users github avatar -->
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p> 
        </div>`; /*number of followers/following. num of repos*/
                                                                                                                
                
                                                            
}

function repoInformationHTML(repos) {                    //function to render repo info(html)
  if (repos.length == 0) {      //if repos length = 0..pass back html that says no repos
      return `<div class="clearfix repo-list">No repos!</div>`;
  } 
  
  var listItemsHTML = repos.map(function(repo) { //array of listitems.function that takes parameters repo. map each repo to a list element. rtn <li>
      return `<li>
                  <a href="${repo.html_url}" target="_blank">${repo.name}</a> <!--url to repo that opens in new page. txt will be name of repo-->
              </li>`;
  });
  
  return `<div class="clearfix repo-list"> 
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}      <!--inject in listitems. join elements together.use new line to seperate them -->
                </ul>
          </div>`;
}                       


function fetchGitHubInformation(event) {            /* takes parameter of event */
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");
    
    var username = $("#gh-username").val();             //store usernamke retrieved from input field. jquery selector..select ID gh-username and rtn value
    if(!username) {             //if not username
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }
    
    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader_gif.gif" alt="loading..." />
        </div>`);
        
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)     //retrieves repo info
        ).then(
            function(firstResponse, secondResponse) {
                var userData = firstResponse[0];
                var repoData = secondResponse[0];
                $("#gh-user-data").html(userInformationHTML(userData)); //write userData to gh-user-data
                $("#gh-repo-data").html(repoInformationHTML(repoData));
            }, function(errorResponse) {
                if (errorResponse.status === 404) {
                    $("#gh-user-data").html(        //write html to gh-user-data
                        `<h2>No info found for user ${username}</h2>`); //display this if error is 404
                }else {
                    console.log(errorResponse); // any other errors..console.log them
                    $("#gh-user-data").html(  //feedback for user. Error and error message
                        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
                }
            });
}

$(document).ready(fetchGitHubInformation);