(function() {
	'use strict';
	$(".tabs-btn").click(function() {
		$(".tabs-btn").removeClass("active");
		$(this).addClass("active");
		$(".tabs-box").removeClass("active");
		$(".tabs-box").eq($(this).index()).addClass("active");
	});

	$(".profile-head-box").click(function() {
		$(".backdrop").addClass("active").addClass("visible");
		$(".photo-pop").addClass("photo-pop-up").removeClass("photo-pop-down");

	});
	$(".backdrop").click(function() {
		$(".backdrop").removeClass("active").removeClass("visible");
		$(".photo-pop").addClass("photo-pop-down").removeClass("photo-pop-up");
	});



})();