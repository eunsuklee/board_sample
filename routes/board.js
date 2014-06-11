var boardList = [
    { id : 1, writer : 'anne', title: 'I am anne of green gables', contents : 'I have a red hair', insertDateTime : new Date(2014,04,25,14,18), updateDateTime : new Date(2014,05,25,14,18)},
    { id : 2, writer : 'gilbert', title: 'I am gilbert', contents : 'I love anne', insertDateTime : new Date(2014,03,05,14,18), updateDateTime : new Date(2014,04,05,14,18)},
    { id : 3, writer : 'diana', title: 'I ame diana', contents : 'I am best friend with anne', insertDateTime : new Date(2014,02,15,14,18), updateDateTime : new Date(2014,03,15,14,18)}
];
//
//function getStartPageNo(currentPageNo, pageSize) {
//    return ((parseInt(currentPageNo, 10)) - 1) * parseInt(pageSize, 10) + 1;
//}
//
//function getEndPageNo(startPageNo, pageSize, totalCount) {
//    var endPageNo = parseInt(startPageNo) + parseInt(pageSize);
//
//    if (endPageNo > totalCount) {
//        return totalCount + 1;
//    } else {
//        return endPageNo;
//    }
//}

function getOne(id) {
    var boardLength = boardList.length;

    for(var i = 0; i < boardLength; i++) {
        var board = boardList[i];
        if (board.id == id) {
            return { index : i, board : board};
        }
    }
}
function getMaxId() {
    var boardLength = boardList.length;
    var maxId = 0;
    for (var i =  0; i < boardLength; i++) {
        var board = boardList[i];
        if (maxId < board.id) {
            maxId = board.id;
        }
    }
    return maxId;
}
exports.list = function(req, res){
//    var currentPageNo = req.param("currentPageNo");
//    var pageSize = req.param("pageSize");
//    var totalCount = boardList.length;
//    var startPageNo = getStartPageNo(currentPageNo, pageSize);
//    var endPageNo = getEndPageNo(startPageNo, pageSize, totalCount);
//
//    var totalPageCount = Math.ceil(totalCount / 10);
//    var result = {list : boardList.slice(startPageNo - 1, endPageNo - 1), totalCount : totalCount, totalPageCount : totalPageCount};
//    res.send(result);
    res.send(boardList);
};

exports.one = function(req, res){
    res.send(getOne(req.params.id).board);
};

exports.insert = function(req, res){
    var board = req.body;
    board.id = getMaxId() + 1;
    board.insertDateTime = new Date();
    board.updateDateTime = new Date();
    boardList.push(board);
    res.send(board);
};

exports.update = function(req, res){
    var board = getOne(req.params.id).board;
    var param = req.body
    board.title = param.title;
    board.contents =  param.contents;
    board.updateDateTime = new Date();
    res.send(board);
};

exports.delete = function(req, res){
    console.log(boardList);
    var index = getOne(req.params.id).index;
    boardList.splice(index, 1);
    console.log(boardList);
    res.send({result : 'success'});
};