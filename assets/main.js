$(function(){
	var api = 'http://github.com/api/v2/json/repos/show/:user/:repository?callback=?';
	var repo_count = 0;
	var template = '<div class="sectiontitle"><a href=":name">:name</a> '+
			'<span>(<a href=":url">view repository</a>)</span></div><p>:description</p>';
	var last_modified = null;

	$.getJSON('config.json',function(config){
		$('#subdomain').text(config.subdomain);
		for(var key in config.repositories)
		{
			var api_request = api
				.replace(/:user/, config.subdomain)
		 		.replace(/:repository/,config.repositories[key]);
			
			$.getJSON(api_request,function(res){
				$('#content').append(template
					.replace(/:url/, res.repository.url)
					.replace(/:name/g, res.repository.name)
					.replace(/:description/, res.repository.description)
				);

				var pushed_at = new Date(res.repository.pushed_at);
				if(!last_modified || pushed_at>last_modified)
				{
					last_modified = pushed_at;
					$('#last-modified').text(pushed_at.toString());
				}
			});
			repo_count++;
		}

		repo_count += (repo_count == 1) ? ' repository' : ' repositories';
		$('#repo-count').text(repo_count);
	});
});