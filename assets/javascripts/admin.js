(function ($, response) { // TODO remove console.log when complete

	"use strict";

	$(function () {

        response.create({
            prop: "width", // property to base tests on
            prefix: "r src", // custom aliased prefixes
            breakpoints: [0, 320, 480, 768, 1024], // custom breakpoints
            lazy: true // enable lazyloading
        });

        response.action(function() {
            // do stuff on ready and resize

            if (response.band(0, 767)) {
                arrangeRows(1);
                fluidCols(1);
                console.log ('1 col');
            }

            if (response.band(768, 1023)) {
                arrangeRows(2);
                fluidCols(2);
                console.log ('2 col');
            }

            if (response.band(1024, 1279)) {
                arrangeRows(3);
                fluidCols(3);
                console.log ('3 col');
            }

            if (response.band(1280, 1679)) {
                arrangeRows(4);
                fluidCols(4);
                console.log ('4 col');
            }

            if (response.band(1680)) {
                arrangeRows(5);
                fluidCols(5);
                console.log ('5 col');
            }

        });

        function fluidCols(numberCols) {

            var contentWidth, activeBackupMargin, contentLessMarginWdith, fluidColWidth;

            contentWidth = $('.mybytes-page-content').width();
            activeBackupMargin = parseInt($('.active-backup').css('margin-right'), 10);
            contentLessMarginWdith = (contentWidth - (activeBackupMargin * numberCols));
            fluidColWidth = Math.floor(((((contentLessMarginWdith * 100) / contentWidth) / numberCols))) + '%';

            $('.active-backup').css('width', fluidColWidth);

        }

        function arrangeRows(numberCols) {

            var numberBackups = $(".active-backup").size();

            if (numberBackups < numberCols) {
                return;
            }
            createRows( $('.active-backup').get(), numberCols );
        }

        function createRows(backups, numberCols) {

            $('.active-backups > .thumbnails').remove();
            $('.active-backups').append('<ul class="thumbnails">');
            for (var i = 0; i < backups.length; i++) {
                if ((i !== 0) && (i % numberCols === 0)) {
                    $('.active-backups').append('</ul><ul class="thumbnails">');
                }
                $('.active-backups .thumbnails:last-child').append(backups[i]);
            }
            $('.active-backups').append('</ul>');

            relocateDetailBlock();

        }

        function relocateDetailBlock() {

            if ( $('.collapse').hasClass('backup-open') ) {
                console.log ('backup relocate');

                var $nomad = $('.backup-open');
                var $nomadBlockID = '#' + $nomad.attr('id');
                var $nomadParentID = $nomad.data('parent');

                $( $nomadBlockID ).insertAfter( $( $nomadParentID ).closest('.thumbnails') );

            }

        }

        function showDetailBlock(elementID) {

            $( elementID )
                .clone()
                .attr('id', function() {
                    return this.id + '-open';
                })
                .addClass('backup-open')
                .removeClass('always-collapse')
                .insertAfter( $(elementID).closest('.thumbnails') );

            $( elementID + '-open' ).collapse('show');

            $( elementID ).parent().addClass('backup-open-active');

        }

        // TODO jquery coding standards for varibales etc - http://www.jameswiseman.com/blog/2010/04/20/jquery-standards-1-jquery-variables/
        $('.mybytes-page-content').on('click', '.backup-detail', function(e) {

            e.preventDefault();

            var $self = $(this);
            var $targetBlockID = $self.data('target');


            // TODO entire collapse and show might be handled best by data-attributes in the source and only use on.hide and on.show in js
            if ( $('.collapse').hasClass('backup-open') ) {

                console.log ('backup open');

                var $nomad = $('.backup-open');
                var $nomadBlockID = '#' + $nomad.attr('id');
                var $nomadParentID = $nomad.data('parent');

                $( $nomadBlockID ).collapse('hide');

                $( $nomadParentID ).parent().removeClass('backup-open-active');

                $( $nomadBlockID ).on('hidden', function () {

                    $( $nomadBlockID ).remove();

                    if ( $targetBlockID === $nomadParentID ) {
                        return;
                    }

                    $( $nomadBlockID ).remove();

                    showDetailBlock( $targetBlockID );

                });

            } else {

                console.log ('nothing open');
                showDetailBlock( $targetBlockID );

            }

        });


        function showSelectedBackup(elementID) {

            console.log ($('.module-select').height());

            $('.module-settings').height($('.module-select').height());
            $('.module-settings').toggle();

            $(elementID + ' .backup-icon')
                .clone()
                .appendTo($('.service-icon'));

            var backupID = $(elementID).data('id');
            var backupName = $(elementID).data('name');
            var backupDescription = $(elementID).data('description');

            $('.service-name').append(backupName);
            $('.service-description').append(backupDescription);
            $('input[name=source]').val(backupName.toLowerCase());

        }

        $('#add-modules').on('show', function () {
            $('#module-search').typeahead({
                source: $('#module-search').data('source'),
                updater: function (item) {
                    // implementation

                    console.log (item);
                    var moduleID = item.toLowerCase();
                    moduleID = moduleID.replace(/\s/g, '');
                    moduleID = '#' + moduleID;
                    console.log (moduleID);

                    showSelectedBackup(moduleID);

                }
            });

            $('html, body').animate({
            	scrollTop: $("#add-modules").offset({ top: 112 })
            });

            $('#add-modules').css('border-bottom-width', '1px');

        });

        $('#add-modules').on('hide', function () {

            $('#add-modules').css('border-bottom-width', '0');

        });

        $('.mybytes-page-content').on('click', '.addbackup', function(e) {

            e.preventDefault();
            showSelectedBackup($(this).data('selector'));
            $('#module-tabs a[href="#settings"]').tab('show');


        });

        $('.mybytes-page-content').on('click', '.close-settings', function(e) {

            e.preventDefault();

            $('.service-icon').empty();
            $('.service-name').empty();
            $('.service-description').empty();
            $('.module-settings').toggle();

        });

        $('#module-tabs a').click(function (e) {
          e.preventDefault();
          $(this).tab('show');
        })



    });

}(jQuery, Response));
