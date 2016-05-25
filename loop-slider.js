var components = components || {};

jQuery(document).ready(function() {
	jQuery('[data-component="loop-slider"]').each(function() {
		var ls = new components.loopSlider(this);
	});
});

components.loopSlider = function(el) {
	var self = this;
	self.el = jQuery(el);
	self.currentPage = 1;
	self.viewport = self.el.find('[data-ls="slide-viewport"]');
	self.pages = self.el.find('[data-ls="slide"]');
	self.transitionDuration = 500;
	self.left = self.el.find('[data-ls="left"]');
	self.right = self.el.find('[data-ls="right"]');
	self.init();
};
components.loopSlider.prototype = {
	init: function() {
		var self = this;
		self.pages.not(':eq(' + self.currentPage + ')').hide();
		self.left.on('click', function() {
			var pageNum = (self.currentPage - 1 < 0) ? self.pages.length - 1 : self.currentPage - 1;
			self.slide(pageNum, 'left');
		});
		self.right.on('click', function() {
			var pageNum = (self.currentPage + 1 == self.pages.length) ? 0 : self.currentPage + 1;
			self.slide(pageNum, 'right');
		});
		jQuery(window).on('resize', function() {
			self.resize();
		});
		self.resize();
		self.reset();
	},
	slide: function(pageNum, direction) {
		var self = this;
		var oldPage = self.currentPage;
		var newPage = pageNum;
		if(typeof direction == 'undefined') {
			direction = (oldPage > newPage) ? 'left' : 'right';
		}
		self.currentPage = pageNum;
		var slideWidth = self.pages.eq(oldPage).width();
		if(oldPage == newPage) {
			self.reset();
		} else if(direction == 'left') { // Slide from left
			self.pages.eq(newPage).css('left', slideWidth * -1).show();
			self.pages.eq(oldPage).animate({
				'left': slideWidth
			}, self.transitionDuration, function() { self.reset(); });
			self.pages.eq(newPage).animate({
				'left': 0
			}, self.transitionDuration, function() { self.reset(); });
		} else if(direction == 'right') { // Slide from right
			self.pages.eq(newPage).css('left', slideWidth).show();
			self.pages.eq(oldPage).animate({
				'left': slideWidth * -1
			}, self.transitionDuration, function() { self.reset(); });
			self.pages.eq(newPage).animate({
				'left': 0
			}, self.transitionDuration, function() { self.reset(); });
		}
	},
	reset: function() {
		// Put in the correct text in the buttons
		var self = this;
		var prevPage = (self.currentPage - 1 < 0) ? self.pages.length - 1 : self.currentPage - 1;
		var nextPage = (self.currentPage + 1 == self.pages.length) ? 0 : self.currentPage + 1;
	},
	resize: function() {
		var self = this;
		self.el.find('[data-ls="slide"]').each(function() {
			jQuery(this).css('width', self.el.width());
		});
		var maxHeight = Math.max.apply(null, jQuery('[data-ls="slide"]').map(function() {
			return jQuery(this).outerHeight();
		}));
		self.viewport.css('min-height', maxHeight);
	}
};
