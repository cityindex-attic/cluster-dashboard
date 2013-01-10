(function(e, t) {
    "use strict";
    e(function() {
        function n(t) {
            var n, r, i, s;
            n = e(".mybytes-page-content").width();
            r = parseInt(e(".active-backup").css("margin-right"), 10);
            i = n - r * t;
            s = Math.floor(i * 100 / n / t) + "%";
            e(".active-backup").css("width", s);
        }
        function r(t) {
            var n = e(".active-backup").size();
            if (n < t) return;
            i(e(".active-backup").get(), t);
        }
        function i(t, n) {
            e(".active-backups > .thumbnails").remove();
            e(".active-backups").append('<ul class="thumbnails">');
            for (var r = 0; r < t.length; r++) {
                r !== 0 && r % n === 0 && e(".active-backups").append('</ul><ul class="thumbnails">');
                e(".active-backups .thumbnails:last-child").append(t[r]);
            }
            e(".active-backups").append("</ul>");
            s();
        }
        function s() {
            if (e(".collapse").hasClass("backup-open")) {
                console.log("backup relocate");
                var t = e(".backup-open"), n = "#" + t.attr("id"), r = t.data("parent");
                e(n).insertAfter(e(r).closest(".thumbnails"));
            }
        }
        function o(t) {
            e(t).clone().attr("id", function() {
                return this.id + "-open";
            }).addClass("backup-open").removeClass("always-collapse").insertAfter(e(t).closest(".thumbnails"));
            e(t + "-open").collapse("show");
            e(t).parent().addClass("backup-open-active");
        }
        function u(t) {
            console.log(e(".module-select").height());
            e(".module-settings").height(e(".module-select").height());
            e(".module-settings").toggle();
            e(t + " .backup-icon").clone().appendTo(e(".service-icon"));
            var n = e(t).data("id"), r = e(t).data("name"), i = e(t).data("description");
            e(".service-name").append(r);
            e(".service-description").append(i);
            e("input[name=source]").val(r);
        }
        t.create({
            prop: "width",
            prefix: "r src",
            breakpoints: [ 0, 320, 480, 768, 1024 ],
            lazy: !0
        });
        t.action(function() {
            if (t.band(0, 767)) {
                r(1);
                n(1);
                console.log("1 col");
            }
            if (t.band(768, 1023)) {
                r(2);
                n(2);
                console.log("2 col");
            }
            if (t.band(1024, 1279)) {
                r(3);
                n(3);
                console.log("3 col");
            }
            if (t.band(1280, 1679)) {
                r(4);
                n(4);
                console.log("4 col");
            }
            if (t.band(1680)) {
                r(5);
                n(5);
                console.log("5 col");
            }
        });
        e(".mybytes-page-content").on("click", ".backup-detail", function(t) {
            t.preventDefault();
            var n = e(this), r = n.data("target");
            if (e(".collapse").hasClass("backup-open")) {
                console.log("backup open");
                var i = e(".backup-open"), s = "#" + i.attr("id"), u = i.data("parent");
                e(s).collapse("hide");
                e(u).parent().removeClass("backup-open-active");
                e(s).on("hidden", function() {
                    e(s).remove();
                    if (r === u) return;
                    e(s).remove();
                    o(r);
                });
            } else {
                console.log("nothing open");
                o(r);
            }
        });
        e("#add-modules").on("show", function() {
            e("#module-search").typeahead({
                source: e("#module-search").data("source"),
                updater: function(e) {
                    console.log(e);
                    var t = e.toLowerCase();
                    t = t.replace(/\s/g, "");
                    t = "#" + t;
                    console.log(t);
                    u(t);
                }
            });
            e("html, body").animate({
                scrollTop: e("#add-modules").offset({
                    top: 112
                })
            });
            e("#add-modules").css("border-bottom-width", "1px");
        });
        e("#add-modules").on("hide", function() {
            e("#add-modules").css("border-bottom-width", "0");
        });
        e(".mybytes-page-content").on("click", ".addbackup", function(t) {
            t.preventDefault();
            u(e(this).data("selector"));
            e('#module-tabs a[href="#settings"]').tab("show");
        });
        e(".mybytes-page-content").on("click", ".close-settings", function(t) {
            t.preventDefault();
            e(".service-icon").empty();
            e(".service-name").empty();
            e(".service-description").empty();
            e(".module-settings").toggle();
        });
        e("#module-tabs a").click(function(t) {
            t.preventDefault();
            e(this).tab("show");
        });
    });
})(jQuery, Response);