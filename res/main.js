var MusicData, UserData, MusicDB;

var PostData = {};
PostData["query"] = "query dxIntlSongs {\n  dx_intl_songs(order_by: [{category: asc}, {order: asc}]) {\n    ...dxIntlSongsFields\n    __typename\n  }\n}\n\nfragment dxIntlSongsFields on dx_intl_songs {\n  id\n  category\n  title\n  order\n  dx_intl_variants(order_by: {deluxe: asc}) {\n    deluxe\n    version\n    active\n    dx_intl_notes(order_by: {difficulty: asc}) {\n      internal_lv\n      difficulty\n      level\n      __typename\n    }\n    __typename\n  }\n}";
PostData["operationName"] = "dxIntlSongs";
PostData["variables"] = {};

window.onload = function() {
    console.log('finish');
};

//Post到Otohi
$.ajax({
    type: "POST",
    url: "https://api.otohi.me/graphql",
    dataType: 'json',
    data: JSON.stringify(PostData),
    success: function(data) {
        MusicData = data;
    }
});

//获取音乐DB
//https://github.com/zetaraku/arcade-songs
$.get("https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json", function(data, status) {
    MusicDB = data;
});

//按钮行为
$(document).ready(function() {
    $("#UpLoadBt").click(function() {
        var GamerDataText = '            <h1>玩家信息</h1>\n' +
            '            <div id="UserBox">\n' +
            '            </div>\n' +
            '            <h1>B35</h1>\n' +
            '            <div class="mdui-row-xs-5 ">\n' +
            '                <div id="B35"></div>\n' +
            '            </div>\n' +
            '            <h1>B15</h1>\n' +
            '            <div class="mdui-row-xs-5 ">\n' +
            '                <div id="B15"></div>\n' +
            '            </div>';
        $("#GamerData").html(GamerDataText);
        var b50Data;
        PostData["operationName"] = "dxIntlRecordWithScores";
        PostData["query"] = "query dxIntlRecordWithScores($nickname: String!) {\n  dx_intl_players(where: {nickname: {_eq: $nickname}}) {\n    updated_at\n    private\n    dx_intl_record {\n      card_name\n      title\n      trophy\n      rating\n      max_rating\n      rating_legacy\n      grade\n      course_rank\n      class_rank\n      __typename\n    }\n    dx_intl_scores {\n      song_id\n      deluxe\n      difficulty\n      score\n      combo_flag\n      sync_flag\n      start\n      __typename\n    }\n    __typename\n  }\n}";
        PostData["variables"] = { nickname: $("#UserName").val() };
        $.ajax({
            type: "POST",
            url: "https://api.otohi.me/graphql",
            dataType: 'json',
            data: JSON.stringify(PostData),
            success: function(data) {
                UserData = data;
                if (UserData.data.dx_intl_players[0] != null) {
                    b50Data = b50();
                    ShowUserInfo(UserData.data.dx_intl_players[0].dx_intl_record);
                    ShowScore(b50Data);
                } else {
                    mdui.alert('输入了错误的用户名，或者Otohi服务器暂时不可用', '警告！');
                }
            }
        });

    });

    $("#OutputImage").click(function() {
        html2canvas(document.querySelector("#GamerData"), {
            allowTaint: true,
            backgroundColor: "#51bcf3"

        }).then(function(canvas) {

            document.body.appendChild(canvas);

        });

    });

});

function PureetoProcess(UserInfo) {
    var Pureeto;
    //没想好起啥名字直接用的プレート
    if (UserInfo.rating >= 15000) {
        Pureeto = "rainbow";
    } else if (UserInfo.rating >= 14500) {
        Pureeto = "platinum";
    } else if (UserInfo.rating >= 14000) {
        Pureeto = "gold";
    } else if (UserInfo.rating >= 13000) {
        Pureeto = "silver";
    } else if (UserInfo.rating >= 12000) {
        Pureeto = "bronze";
    } else if (UserInfo.rating >= 10000) {
        Pureeto = "purple";
    } else if (UserInfo.rating >= 7000) {
        Pureeto = "red";
    } else if (UserInfo.rating >= 4000) {
        Pureeto = "orange";
    } else if (UserInfo.rating >= 2000) {
        Pureeto = "green";
    } else if (UserInfo.rating >= 1000) {
        Pureeto = "blue";
    } else {
        Pureeto = "normal";
    }
    return Pureeto;
}




function ShowScore(b50) {

    var i = 0;
    while (i < 35) {
        $("#B35").before(InfoCard(b50.Oldb35[i]));
        i = i + 1;
    }

    i = 0;
    while (i < 15) {
        $("#B15").before(InfoCard(b50.Newb15[i]));
        i = i + 1;
    }
}

function ShowUserInfo(UserInfo) {
    var InfoText = '<div class="UserInfo">\n' +
        '                <div class="rating" style="background-image: url(&quot;./res/image/ratings/' + PureetoProcess(UserInfo) + '.svg&quot;);">' + UserInfo.rating + '</div>\n' +
        '            </div>\n' +
        '            <div class="UserInfo">\n' +
        '                <div class="name">' + UserInfo.card_name + '</div>\n' +
        '                <div>\n' +
        '                    <img src="./res/image/course_ranks/' + UserInfo.course_rank + '.svg" alt="' + UserInfo.course_rank + '" class="rank">\n' +
        '                    <img src="./res/image/class_ranks/' + UserInfo.class_rank + '.svg" alt="' + UserInfo.class_rank + '" class="rank">\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="' + UserInfo.trophy + ' trophy" aria-label="' + UserInfo.title + '">' + UserInfo.title + '</div>';

    $("#UserBox").html(InfoText);
}

function InfoCard(SongData) {
    var DifficultColor;

    if (SongData.difficulty == 0) {
        DifficultColor = "#6fe163";
    } else if (SongData.difficulty == 1) {
        DifficultColor = "#f8df3a";
    } else if (SongData.difficulty == 2) {
        DifficultColor = "#ff828e";
    } else if (SongData.difficulty == 3) {
        DifficultColor = "#9f51dc";
    } else if (SongData.difficulty == 4) {
        DifficultColor = "#e5ddea";
    } else {
        DifficultColor = "black";
    }


    var CardText = '<div style="background-color:' + DifficultColor + ' ; background-clip: content-box; padding-top: 5px;" class="mdui-col" class="mdui-card">\n' +
        '                <div class="mdui-card-media">\n' +
        '                    <img src="https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/' + SongData.imageName + '" />\n' +
        '                    <div class="mdui-card-media-covered mdui-card-media-covered-gradient">\n' +
        '                        <div class="mdui-card-primary">\n' +
        '                            <div style="white-space:nowrap; text-overflow:ellipsis; word-break:break-all; overflow:hidden;" class="">' + SongData.Title + '</div>\n' +
        '                            <div class="mdui-row-xs-5">\n' +
        '                                <img class="mdui-col" style="width: 25%;" src="./res/image/rate/music_icon_' + SongData.ScoreName + '.png" />\n' +
        '                                <img class="mdui-col" style="width: 25%;" src="./res/image/flags/music_icon_' + SongData.combo_flag + '.png" />\n' +
        '                                <img class="mdui-col" style="width: 25%;" src="./res/image/flags/music_icon_' + SongData.sync_flag + '.png" />\n' +
        '                                <img class="mdui-col" style="width: 25%;" src="./res/image/variants/' + SongData.deluxe + '.png" />\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div>\n' +
        '                    <div style="color:white;">Rating:' + Math.trunc(SongData.Rating) + ' LV:' + SongData.InternalLv + '<br>Score:' + SongData.score + '%</div>\n' +
        '                </div>\n' +
        '            </div>';

    return CardText;
}





//b50
function b50() {
    var ScoreMix = UserData.data.dx_intl_players[0].dx_intl_scores;
    var RatingMix, Output;
    var OldRating = [],
        NewRating = [];
    var Oldb35 = [],
        Newb15 = [];
    var i = 0,
        j = 0,
        k = 0;
    RatingMix = RatingGeneratet();
    //添加封面信息
    RatingMix = AddCover(RatingMix);

    while (i < ScoreMix.length) {
        if (RatingMix[i].Version == 18) {
            NewRating[j] = RatingMix[i];
            j = j + 1;
        } else {
            OldRating[k] = RatingMix[i];
            k = k + 1;
        }
        i = i + 1;
    }

    OldRating.sort(function(a, b) {
        return b.Rating - a.Rating
    })
    NewRating.sort(function(a, b) {
        return b.Rating - a.Rating
    })

    Oldb35 = OldRating.slice(0, 35);
    Newb15 = NewRating.slice(0, 15);
    console.log(Oldb35);
    console.log(Newb15);
    Output = { Oldb35: Oldb35, Newb15: Newb15 };

    return Output;
}

//解析每一首歌的Rating
function RatingGeneratet() {
    var i = 0;
    var ScoreMix = UserData.data.dx_intl_players[0].dx_intl_scores;
    var SongMd5, Difficulty, Score, Detail, Achv, InternalLv, RatingMix;

    //生成Rating并放在一起
    while (i < ScoreMix.length) {
        Score = ScoreMix[i];
        //歌曲MD5
        SongMd5 = Score.song_id;
        //查询歌曲详细信息
        Detail = (MusicData.data.dx_intl_songs).find(array => array.id === SongMd5);
        Achv = Score.score;
        Difficulty = (Detail.dx_intl_variants).find(array => array.deluxe === Score.deluxe);
        if (Difficulty.dx_intl_notes[Score.difficulty].internal_lv != null) {
            InternalLv = Difficulty.dx_intl_notes[Score.difficulty].internal_lv;
        } else {
            InternalLv = parseInt(Difficulty.dx_intl_notes[Score.difficulty].level);
        }
        RatingMix = Rating(Achv, InternalLv)

        ScoreMix[i]["Rating"] = RatingMix.Rating;
        ScoreMix[i]["ScoreName"] = RatingMix.Title;
        ScoreMix[i]["Title"] = Detail.title;
        ScoreMix[i]["Version"] = Difficulty.version;
        ScoreMix[i]["InternalLv"] = InternalLv;
        ScoreMix[i]["category"] = RatingMix.category;
        i = i + 1;
    }

    console.log(ScoreMix);
    return ScoreMix;
}

//为每一首歌匹配封面
function AddCover(SongData) {
    var i = 0;
    var SongDetail;
    while (i < SongData.length) {
        SongDetail = (MusicDB.songs).find(array => array.title === SongData[i].Title);
        SongData[i].imageName = SongDetail.imageName;
        SongData[i].category = SongDetail.category;
        i = i + 1;
    }
    return SongData;
}


//Rating生成参考链接 https://github.com/myjian/mai-tools/
function Rating(Achv, InternalLv) {
    var Rating;
    var Title;
    if (Achv >= 100.5) {
        Rating = InternalLv * 22.4 * 100.5 * 0.01;
        Title = 13;
    } else if (Achv >= 100) {
        Rating = InternalLv * 21.6 * Achv * 0.01;
        Title = 12;
    } else if (Achv >= 99.5) {
        Rating = InternalLv * 21.1 * Achv * 0.01;
        Title = 11;
    } else if (Achv >= 99) {
        Rating = InternalLv * 20.8 * Achv * 0.01;
        Title = 10;
    } else if (Achv >= 98) {
        Rating = InternalLv * 20.3 * Achv * 0.01;
        Title = 9;
    } else if (Achv >= 97) {
        Rating = InternalLv * 20 * Achv * 0.01;
        Title = 8;
    } else if (Achv >= 94) {
        Rating = InternalLv * 16.8 * Achv * 0.01;
        Title = 7;
    } else if (Achv >= 90) {
        Rating = InternalLv * 15.2 * Achv * 0.01;
        Title = 6;
    } else if (Achv >= 80) {
        Rating = InternalLv * 13.6 * Achv * 0.01;
        Title = 5;
    } else if (Achv >= 75) {
        Rating = InternalLv * 12 * Achv * 0.01;
        Title = 4;
    } else if (Achv >= 70) {
        Rating = InternalLv * 11.2 * Achv * 0.01;
        Title = 3;
    } else if (Achv >= 60) {
        Rating = InternalLv * 9.6 * Achv * 0.01;
        Title = 2;
    } else if (Achv >= 50) {
        Rating = InternalLv * 8 * Achv * 0.01;
        Title = 1;
    } else {
        Rating = 0;
        Title = 0;
    }
    return { Rating: Rating, Title: Title };
}