
$(function () {
    //≈–∂œ «∑Òœ‘ æ96% Ω· ¯
    $("#MoreInfo4").focus(function () {
        var a2 = $(document).height();
        $('body,html').animate({ scrollTop: a2 }, 1000);
    });
    AutoComplete.setup({
        "inputElement": "MoreInfo",
        "dataSource": s,
        "displayZoneWidth": 200,
        "maxMatchedItemNumberAllowed": 6,
        "inputEnterCallback": function (obj) {
            //submitOnClick();
        },
        "trClickCallback": function (obj) {
        }
    });
    AutoComplete.setup({
        "inputElement": "MoreInfo2",
        "dataSource": s,
        "displayZoneWidth": 200,
        "maxMatchedItemNumberAllowed": 6,
        "inputEnterCallback": function (obj) {
            //submitOnClick();
        },
        "trClickCallback": function (obj) {
        }
    });
    //AutoComplete.setup({
    //    "inputElement": "MoreInfo3",
    //    "dataSource": s,
    //    "displayZoneWidth": 200,
    //    "maxMatchedItemNumberAllowed": 6,
    //    "inputEnterCallback": function (obj) {
    //        //submitOnClick();
    //    },
    //    "trClickCallback": function (obj) {
    //    }
    //});
    //AutoComplete.setup({
    //    "inputElement": "MoreInfo4",
    //    "dataSource": s,
    //    "displayZoneWidth": 200,
    //    "maxMatchedItemNumberAllowed": 6,
    //    "inputEnterCallback": function (obj) {
    //        //submitOnClick();
    //    },
    //    "trClickCallback": function (obj) {
    //    }
    //});
});






   