(function(){dust.register("board-list",body_0);function body_0(chk,ctx){return chk.write("<h2>").reference(ctx.get("name"),ctx,"h").write("</h2>");}return body_0;})();(function(){dust.register("global",body_0);function body_0(chk,ctx){return chk.write("<!DOCTYPE html><html><head><title>").reference(ctx.get("title"),ctx,"h").write("</title><link rel='stylesheet' href='/stylesheets/style.css' /><link rel='stylesheet' href='/stylesheets/bootstrap.min.css' /><link rel='stylesheet' href='/stylesheets/jquery.gridster.min.css' /><script>window.app = {route: '").reference(ctx.get("route"),ctx,"h").write("',url: '").reference(ctx.get("url"),ctx,"h").write("',params: ").reference(ctx.get("params"),ctx,"h",["s"]).write("};</script></head><body><div id=\"app\">").reference(ctx.get("markup"),ctx,"h",["s"]).write("</div><script src=\"/socket.io/socket.io.js\"></script><script data-main=\"/javascripts/frontend-bootstrap.js\" src=\"/javascripts/lib/require.js\"></script></body></html>");}return body_0;})();(function(){dust.register("index",body_0);function body_0(chk,ctx){return chk.write("<h1>Decision Boards</h1><ul>").section(ctx.get("boards"),ctx,{"block":body_1},null).write("</ul>");}function body_1(chk,ctx){return chk.write("<li><a href=\"/boards/").reference(ctx.get("key"),ctx,"h").write("\" class=\"push-link\">").reference(ctx.getPath(false,["value","title"]),ctx,"h").write("</a></li>");}return body_0;})();(function(){dust.register("board",body_0);function body_0(chk,ctx){return chk.write("<div class=\"board container\"><h2>").reference(ctx.get("title"),ctx,"h").write("</h2><div class=\"gridster\"><ul style=\"height: 480px; position: relative;\"></ul></div></div>");}return body_0;})();(function(){dust.register("board-card",body_0);function body_0(chk,ctx){return chk.write("<li data-row=\"").reference(ctx.get("row"),ctx,"h").write("\" data-col=\"").reference(ctx.get("col"),ctx,"h").write("\" data-sizex=\"1\" data-sizey=\"1\"><div class=\"card\"><h3>").reference(ctx.get("title"),ctx,"h").write("</h3><h4>").reference(ctx.get("subtitle"),ctx,"h").write("</h4></div></li>");}return body_0;})();