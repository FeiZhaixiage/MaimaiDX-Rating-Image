var progress = 0;
var progressMax = 151;
var b50Data;



//输出大图
$(document).ready(function() {
    $("#OutputCanvas").click(function() {
        $('#DownloadImage').attr("disabled", "");
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
                    $("#GameDataCanvasBox").html('<canvas style="width: 100%;" id="GameDataCanvas" width="1920" height="1700"></canvas>');
                    b50Data = b50();
                    LoadData(b50Data);
                    //draw(b50Data, img);
                } else {
                    mdui.alert('输入了错误的用户名，或者Otohi服务器暂时不可用', '警告！');
                    //console.log("e");
                }
            }
        });


    })

    $("#DownloadImage").click(function() {
        var canvas = document.getElementById('GameDataCanvas')
        var href = canvas.toDataURL(); // 获取canvas对应的base64编码
        var a = document.createElement('a'); // 创建a标签
        a.download = 'b50_' + UserData.data.dx_intl_players[0].updated_at + '.png'; // 设置图片名字
        a.href = href;
        a.dispatchEvent(new MouseEvent('click'));
    })

});



function draw(b50Data, img) {
    var canvas = document.getElementById('GameDataCanvas');
    if (!canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var UserInfo = UserData.data.dx_intl_players[0].dx_intl_record;
    //Background
    ctx.drawImage(img.Background, 0, 0, 1920, 1700);
    //NamePlate
    var x = 390,
        y = 35;
    //姓名框底图
    ctx.drawImage(img.NamePlate.Background, x, y, 942, 152);
    //icon
    ctx.drawImage(img.NamePlate.Icon, x + 13, y + 11, 129, 129);
    //称号底板
    ctx.drawImage(img.NamePlate.trophy[UserInfo.trophy], x + 150, y + 15, 355, 26);
    //NameBox
    ctx.drawImage(img.NamePlate.name, x + 150, y + 53, 215, 34);
    //Rating
    ctx.drawImage(img.NamePlate.ratings[PureetoProcess(UserInfo)], x + 150, y + 95, 148, 43);
    //course_ranks
    ctx.drawImage(img.NamePlate.course_ranks[UserInfo.course_rank], x + 310, y + 95, 107, 43);
    //class_ranks
    ctx.drawImage(img.NamePlate.class_ranks[UserInfo.class_rank], x + 430, y + 95, 77, 43);
    //称号
    ctx.lineWidth = 3;
    ctx.font = '15px Roboto';
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.strokeText(UserInfo.title, x + 327, y + 21);
    ctx.fillStyle = "white";
    ctx.fillText(UserInfo.title, x + 327, y + 21);
    ctx.textAlign = "start";
    ctx.font = '25px Roboto';
    ctx.fillStyle = "black";
    ctx.fillText(UserInfo.card_name, x + 155, y + 60);
    ctx.font = '22px Roboto';
    ctx.fillStyle = "white";
    if (UserInfo.rating >= 10000) {
        ctx.fillText(String(UserInfo.rating)[0], x + 215, y + 108);
        ctx.fillText(String(UserInfo.rating)[1], x + 230, y + 108);
        ctx.fillText(String(UserInfo.rating)[2], x + 245, y + 108);
        ctx.fillText(String(UserInfo.rating)[3], x + 260, y + 108);
        ctx.fillText(String(UserInfo.rating)[4], x + 275, y + 108);
    } else if (UserInfo.rating >= 1000) {
        ctx.fillText(String(UserInfo.rating)[0], x + 230, y + 108);
        ctx.fillText(String(UserInfo.rating)[1], x + 245, y + 108);
        ctx.fillText(String(UserInfo.rating)[2], x + 260, y + 108);
        ctx.fillText(String(UserInfo.rating)[3], x + 275, y + 108);
    } else if (UserInfo.rating >= 100) {
        ctx.fillText(String(UserInfo.rating)[0], x + 245, y + 108);
        ctx.fillText(String(UserInfo.rating)[1], x + 260, y + 108);
        ctx.fillText(String(UserInfo.rating)[2], x + 275, y + 108);
    } else if (UserInfo.rating >= 10) {
        ctx.fillText(String(UserInfo.rating)[0], x + 260, y + 108);
        ctx.fillText(String(UserInfo.rating)[1], x + 275, y + 108);
    } else {
        ctx.fillText(String(UserInfo.rating), x + 275, y + 108);
    }

    //水印【实在不喜欢可以把true改成false（（（（ 】
    if (true) {
        ctx.drawImage(img.logo, x + 650, y + 18, 250, 120);
    }


    //b50
    var i = 0,
        j = 0,
        k = 0;

    x = 40;
    y = 255;
    //b35
    while (j < 7) {
        while (i < 5) {
            //检测是否有数据
            if (img.b35[i] != null) {
                //难度框
                ctx.drawImage(img.CoverColor[b50Data.Oldb35[k].difficulty], x + (370 * i), y + (140 * j), 350, 130);
                //乐曲封面
                ctx.drawImage(img.b35[k], x + (370 * i) + 10, y + (140 * j) + 10, 106, 105);
                //成绩标识图
                ctx.drawImage(img.rate[b50Data.Oldb35[k].ScoreName], x + (370 * i) + 260, y + (140 * j) + 55, 85, 29);
                //新旧曲
                if (b50Data.Oldb35[k].deluxe) {
                    ctx.drawImage(img.deluxe[1], x + (370 * i) + 10, y + (140 * j) + 103, 33, 37);
                } else {
                    ctx.drawImage(img.deluxe[0], x + (370 * i) + 10, y + (140 * j) + 103, 33, 37);
                }
                //连击徽章
                ctx.drawImage(img.flags['music_icon_' + b50Data.Oldb35[k].combo_flag], x + (370 * i) + 255, y + (140 * j) + 87, 42, 47);
                //友人徽章
                ctx.drawImage(img.flags['music_icon_' + b50Data.Oldb35[k].sync_flag], x + (370 * i) + 300, y + (140 * j) + 87, 42, 47);
                //可否再此基础上加Rating
                if (b50Data.Oldb35[k].score >= 100.5) {
                    ctx.drawImage(img.flags['music_icon_max'], x + (370 * i) + 90, y + (140 * j) + 115, 25, 15);
                }
                //乐曲名
                ctx.font = '20px Roboto';
                ctx.fillStyle = "white";
                ctx.textBaseline = "top";
                if (b50Data.Oldb35[k].Title.length > 9) {
                    b50Data.Oldb35[k].Title = b50Data.Oldb35[k].Title.substring(0, 10) + '...';
                }
                ctx.fillText(b50Data.Oldb35[k].Title, x + (370 * i) + 140, y + (140 * j) + 15, 150);
                //乐曲种类
                ctx.font = '10px Roboto';
                ctx.fillText(b50Data.Oldb35[k].category, x + (370 * i) + 140, y + (140 * j) + 37, 150);
                //乐曲得分
                ctx.font = 'normal bold 30px Roboto';
                ctx.fillStyle = "#fadf62";
                ctx.fillText(String(b50Data.Oldb35[k].score).split(".")[0] + '.', x + (370 * i) + 135, y + (140 * j) + 60, 150);
                ctx.font = 'normal bold 17px Roboto';
                if (String(b50Data.Oldb35[k].score).split(".")[0].length == 3) {
                    ctx.fillText(String(b50Data.Oldb35[k].score).split(".")[1], x + (370 * i) + 197, y + (140 * j) + 70, 150);
                } else {
                    ctx.fillText(String(b50Data.Oldb35[k].score).split(".")[1], x + (370 * i) + 180, y + (140 * j) + 70, 150);
                }
                ctx.font = 'normal bold 20px Roboto';
                ctx.fillStyle = "black";
                ctx.fillText(b50Data.Oldb35[k].InternalLv + ' -> ' + Math.trunc(b50Data.Oldb35[k].Rating), x + (370 * i) + 135, y + (140 * j) + 103, 150);
            } else {
                ctx.drawImage(img.CoverColor[5], x + (370 * i), y + (140 * j), 350, 130);
            }


            k = k + 1;
            i = i + 1;
        }
        j = j + 1;
        i = 0;
    }
    j = 0;
    i = 0;
    k = 0;
    y = 1270;
    //b15
    while (j < 3) {
        while (i < 5) {
            if (img.b15[i] != null) {
                ctx.drawImage(img.CoverColor[b50Data.Newb15[k].difficulty], x + (370 * i), y + (140 * j), 350, 130);
                ctx.drawImage(img.b15[k], x + (370 * i) + 10, y + (140 * j) + 10, 106, 105);
                ctx.drawImage(img.rate[b50Data.Newb15[k].ScoreName], x + (370 * i) + 260, y + (140 * j) + 55, 85, 29);
                if (b50Data.Newb15[k].deluxe) {
                    ctx.drawImage(img.deluxe[1], x + (370 * i) + 10, y + (140 * j) + 103, 33, 37);
                } else {
                    ctx.drawImage(img.deluxe[0], x + (370 * i) + 10, y + (140 * j) + 103, 33, 37);
                }
                ctx.drawImage(img.flags['music_icon_' + b50Data.Newb15[k].combo_flag], x + (370 * i) + 255, y + (140 * j) + 87, 42, 47);
                ctx.drawImage(img.flags['music_icon_' + b50Data.Newb15[k].sync_flag], x + (370 * i) + 300, y + (140 * j) + 87, 42, 47);
                //可否再此基础上加Rating
                if (b50Data.Newb15[k].score >= 100.5) {
                    ctx.drawImage(img.flags['music_icon_max'], x + (370 * i) + 90, y + (140 * j) + 115, 25, 15);
                }
                ctx.font = '20px Roboto';
                ctx.fillStyle = "white";
                ctx.textBaseline = "top";
                if (b50Data.Newb15[k].Title.length > 9) {
                    b50Data.Newb15[k].Title = b50Data.Newb15[k].Title.substring(0, 10) + '...';
                }
                ctx.fillText(b50Data.Newb15[k].Title, x + (370 * i) + 140, y + (140 * j) + 15, 150);
                ctx.font = '10px Roboto';
                ctx.fillText(b50Data.Newb15[k].category, x + (370 * i) + 140, y + (140 * j) + 37, 150);
                //乐曲得分
                ctx.font = 'normal bold 30px Roboto';
                ctx.fillStyle = "#fadf62";
                ctx.fillText(String(b50Data.Newb15[k].score).split(".")[0] + '.', x + (370 * i) + 135, y + (140 * j) + 60, 150);
                ctx.font = 'normal bold 17px Roboto';
                if (String(b50Data.Newb15[k].score).split(".")[0].length == 3) {
                    ctx.fillText(String(b50Data.Newb15[k].score).split(".")[1], x + (370 * i) + 197, y + (140 * j) + 70, 150);
                } else {
                    ctx.fillText(String(b50Data.Newb15[k].score).split(".")[1], x + (370 * i) + 180, y + (140 * j) + 70, 150);
                }
                ctx.font = 'normal bold 20px Roboto';
                ctx.fillStyle = "black";
                ctx.fillText(b50Data.Newb15[k].InternalLv + ' -> ' + Math.trunc(b50Data.Newb15[k].Rating), x + (370 * i) + 135, y + (140 * j) + 103, 150);

            } else {
                ctx.drawImage(img.CoverColor[5], x + (370 * i), y + (140 * j), 350, 130);
            }

            i = i + 1;
            k = k + 1;
        }
        j = j + 1;
        i = 0;

    }

}

function ImgBase() {
    this.CoverColor = [];
    this.rate = [];
    this.deluxe = [];
    this.b35 = [];
    this.b15 = [];
    this.logo = null;
    this.flags = {};
    this.Background = null;
    this.NamePlate = { trophy: {}, ratings: {}, course_ranks: {}, class_ranks: [] };
    //this = { CoverColor: [], rate: [], deluxe: [], b35: [], b15: [], logo: null, flags: {}, NamePlate: { trophy: {}, ratings: {} } };
}

var img = new ImgBase();

function LoadData(b50Data) {
    var i = 0;
    //BackGround
    img.Background = new Image();
    img.Background.src = './res/image/background/1.png';
    img.Background.onload = function() { MarkDownProgress() };

    //NamePlate
    //背图
    img.NamePlate.Background = new Image();
    img.NamePlate.Background.src = './res/image/name_plate/1.png';
    img.NamePlate.Background.onload = function() { MarkDownProgress() };
    //icon
    img.NamePlate.Icon = new Image();
    img.NamePlate.Icon.src = './res/image/icon/1.png';
    img.NamePlate.Icon.onload = function() { MarkDownProgress() };
    //称号
    img.NamePlate.trophy['normal'] = new Image();
    img.NamePlate.trophy['normal'].src = './res/image/trophy/normal.png';
    img.NamePlate.trophy['normal'].onload = function() { MarkDownProgress() };
    img.NamePlate.trophy['bronze'] = new Image();
    img.NamePlate.trophy['bronze'].src = './res/image/trophy/bronze.png';
    img.NamePlate.trophy['bronze'].onload = function() { MarkDownProgress() };
    img.NamePlate.trophy['silver'] = new Image();
    img.NamePlate.trophy['silver'].src = './res/image/trophy/silver.png';
    img.NamePlate.trophy['silver'].onload = function() { MarkDownProgress() };
    img.NamePlate.trophy['gold'] = new Image();
    img.NamePlate.trophy['gold'].src = './res/image/trophy/gold.png';
    img.NamePlate.trophy['gold'].onload = function() { MarkDownProgress() };
    img.NamePlate.trophy['rainbow'] = new Image();
    img.NamePlate.trophy['rainbow'].src = './res/image/trophy/rainbow.png';
    img.NamePlate.trophy['rainbow'].onload = function() { MarkDownProgress() };
    //姓名
    img.NamePlate.name = new Image();
    img.NamePlate.name.src = './res/image/name/name_box.png';
    img.NamePlate.name.onload = function() { MarkDownProgress() };
    //ratings
    img.NamePlate.ratings['normal'] = new Image();
    img.NamePlate.ratings['normal'].src = './res/image/ratings/normal.svg';
    img.NamePlate.ratings['normal'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['blue'] = new Image();
    img.NamePlate.ratings['blue'].src = './res/image/ratings/blue.svg';
    img.NamePlate.ratings['blue'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['green'] = new Image();
    img.NamePlate.ratings['green'].src = './res/image/ratings/green.svg';
    img.NamePlate.ratings['green'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['orange'] = new Image();
    img.NamePlate.ratings['orange'].src = './res/image/ratings/orange.svg';
    img.NamePlate.ratings['orange'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['red'] = new Image();
    img.NamePlate.ratings['red'].src = './res/image/ratings/red.svg';
    img.NamePlate.ratings['red'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['purple'] = new Image();
    img.NamePlate.ratings['purple'].src = './res/image/ratings/purple.svg';
    img.NamePlate.ratings['purple'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['bronze'] = new Image();
    img.NamePlate.ratings['bronze'].src = './res/image/ratings/bronze.svg';
    img.NamePlate.ratings['bronze'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['silver'] = new Image();
    img.NamePlate.ratings['silver'].src = './res/image/ratings/silver.svg';
    img.NamePlate.ratings['silver'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['gold'] = new Image();
    img.NamePlate.ratings['gold'].src = './res/image/ratings/gold.svg';
    img.NamePlate.ratings['gold'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['platinum'] = new Image();
    img.NamePlate.ratings['platinum'].src = './res/image/ratings/platinum.svg';
    img.NamePlate.ratings['platinum'].onload = function() { MarkDownProgress() };
    img.NamePlate.ratings['rainbow'] = new Image();
    img.NamePlate.ratings['rainbow'].src = './res/image/ratings/rainbow.svg';
    img.NamePlate.ratings['rainbow'].onload = function() { MarkDownProgress() };
    //course_ranks
    i = 0;
    while (i < 22) {
        if (i >= 11) {
            img.NamePlate.course_ranks[String(i + 1)] = new Image();
            img.NamePlate.course_ranks[String(i + 1)].src = './res/image/course_ranks/' + String(i) + '.svg';
            img.NamePlate.course_ranks[String(i + 1)].onload = function() { MarkDownProgress() };
        } else {
            img.NamePlate.course_ranks[String(i)] = new Image();
            img.NamePlate.course_ranks[String(i)].src = './res/image/course_ranks/' + String(i) + '.svg';
            img.NamePlate.course_ranks[String(i)].onload = function() { MarkDownProgress() };
        }

        i = i + 1;
    }
    //Class_Ranks
    i = 0;
    while (i < 26) {
        img.NamePlate.class_ranks[i] = new Image();
        img.NamePlate.class_ranks[i].src = './res/image/class_ranks/' + i + '.svg';
        img.NamePlate.class_ranks[i].onload = function() { MarkDownProgress() };
        i = i + 1;
    }

    //B50
    //封面b35
    i = 0;
    while (i < 35) {
        if (i < b50Data.Oldb35.length) {
            img.b35[i] = new Image();
            img.b35[i].crossOrigin = 'Anonymous';
            img.b35[i].src = 'https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/' + b50Data.Oldb35[i].imageName + '?123456';
            img.b35[i].onload = function() { MarkDownProgress() };
        } else {
            MarkDownProgress();
        }
        i = i + 1;
    }
    //封面b15
    i = 0;
    while (i < 15) {
        if (i < b50Data.Newb15.length) {
            img.b15[i] = new Image();
            img.b15[i].crossOrigin = 'Anonymous';
            img.b15[i].src = 'https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/' + b50Data.Newb15[i].imageName + '?123456';
            img.b15[i].onload = function() { MarkDownProgress() };
        } else {
            MarkDownProgress();
        }
        i = i + 1;
    }

    i = 0;
    //绿到白（含空）
    while (i < 6) {
        img.CoverColor[i] = new Image();
        img.CoverColor[i].src = './res/image/cover_color/' + i + '.png';
        img.CoverColor[i].onload = function() { MarkDownProgress() };
        i = i + 1;
    }
    i = 0;
    //D到SSS+
    while (i < 14) {
        img.rate[i] = new Image();
        img.rate[i].src = './res/image/rate_full/' + i + '.png';
        img.rate[i].onload = function() { MarkDownProgress() };
        i = i + 1;
    }

    //DX标识
    img.deluxe[0] = new Image();
    img.deluxe[0].src = './res/image/variants/false.png';
    img.deluxe[0].onload = function() { MarkDownProgress() };
    img.deluxe[1] = new Image();
    img.deluxe[1].src = './res/image/variants/true.png';
    img.deluxe[1].onload = function() { MarkDownProgress() };

    //Flags
    img.flags["music_icon_"] = new Image();
    img.flags["music_icon_"].src = './res/image/flags/music_icon_.png';
    img.flags["music_icon_"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_ap"] = new Image();
    img.flags["music_icon_ap"].src = './res/image/flags/music_icon_ap.png';
    img.flags["music_icon_ap"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_ap+"] = new Image();
    img.flags["music_icon_ap+"].src = './res/image/flags/music_icon_ap+.png';
    img.flags["music_icon_ap+"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_fc"] = new Image();
    img.flags["music_icon_fc"].src = './res/image/flags/music_icon_fc.png';
    img.flags["music_icon_fc"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_fc+"] = new Image();
    img.flags["music_icon_fc+"].src = './res/image/flags/music_icon_fc+.png';
    img.flags["music_icon_fc+"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_fs"] = new Image();
    img.flags["music_icon_fs"].src = './res/image/flags/music_icon_fs.png';
    img.flags["music_icon_fs"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_fs+"] = new Image();
    img.flags["music_icon_fs+"].src = './res/image/flags/music_icon_fs+.png';
    img.flags["music_icon_fs+"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_fdx"] = new Image();
    img.flags["music_icon_fdx"].src = './res/image/flags/music_icon_fdx.png';
    img.flags["music_icon_fdx"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_fdx+"] = new Image();
    img.flags["music_icon_fdx+"].src = './res/image/flags/music_icon_fdx+.png';
    img.flags["music_icon_fdx+"].onload = function() { MarkDownProgress() };
    img.flags["music_icon_max"] = new Image();
    img.flags["music_icon_max"].src = './res/image/flags/music_icon_max.png';
    img.flags["music_icon_max"].onload = function() { MarkDownProgress() };

    //LOGO
    img.logo = new Image();
    img.logo.src = './res/image/logo/logo.png';
    img.logo.onload = function() { MarkDownProgress() };

    return img;
}


function MarkDownProgress() {
    progress = progress + 1;
    console.log(progress);
    $("#progress").attr("style", "width: " + (progress / progressMax * 100) + "%;");
    if (progress >= progressMax) {
        console.log("ok")
        draw(b50Data, img);
        b50Data = null;
        img = new ImgBase();
        progress = 0;
        $('#DownloadImage').removeAttr("disabled");
    }
}



function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}