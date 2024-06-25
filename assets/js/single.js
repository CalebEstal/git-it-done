var repoNameE1 = document.querySelector("#repo-name")

var limitWarningE1 = document.querySelector("#limit-warning");

var issuesContainerE1 = document.querySelector("#issues-container");

var getRepoName = function() {
    var queryString = document.location.search;

    var repoName = queryString.split("=")[1];
    
    if (repoName) {
        repoNameE1.textContent = repoName;
        getRepoIssues(repoName);
    }
    else {
        document.location.replace("./index.html")
    }
}

var displayWarning = function(repo) {
    //add task to warning container
    limitWarningE1.textContent = "To see more than 30 issues, visit ";
    
    var linkE1 = document.createElement("a");
    linkE1.textContent = "See More Issues on GitHub.com";
    linkE1.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkE1.setAttribute("target", "_blank");

    //append to warning container
    limitWarningE1.appendChild(linkE1);
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issuesContainerE1.textContent = "This repo has no open issues!";
        return;
    };
    
    for (var i=0; i < issues.length; i++) {
        //create a link element to take users to the issue on github
        var issueE1 = document.createElement("a");
        issueE1.classList = "list-item flex-row justify-space-between align-center";
        issueE1.setAttribute("href", issues[i].html_url);
        issueE1.setAttribute("target", "_blank");

        //create a span to hold issue title
        var titleE1 = document.createElement("span");
        titleE1.textContent = issues[i].title;

        //append to container
        issueE1.appendChild(titleE1);

        //create a type element
        var typeE1 = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeE1.textContent = "(Pull request)";
        }
        else {
            typeE1.textContent = "(Issue)";
        }

        //appent to container
        issueE1.appendChild(typeE1);

        issuesContainerE1.appendChild(issueE1);
    };
};

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //pass response data to dom function
                displayIssues(data);

                //check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                };
            });
        }
        else {
            document.location.replace("./index.html");
        };
    });
};

getRepoName();
