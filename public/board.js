$(function(){
    var Board = Backbone.Model.extend({
        urlRoot: '/board',
        validate: function(attrs, options) {
            var errorList = [];
            if (attrs.writer== '') {
                errorList.push({ name : 'writer',  msg :"작성자를 입력하세요."});
            }
            if (attrs.title == '') {
                errorList.push({ name : 'title',  msg :"제목을 입력하세요."});
            }
            if (attrs.contents == '') {
                errorList.push({ name : 'contents',  msg :"내용을 입력하세요."});
            }
            if (errorList.length > 0) {
                return errorList;
            }
        },
        parse: function(response) {
            response.insertDateTime =  new Date(response.insertDateTime).format("Y-m-d");
            return response;
        }
    });

    var BoardList = Backbone.Collection.extend({
        model: Board,
        url: '/board',
//        comparator: function(model1, model2) {
//        return  model1.get("id") < model2.get("id");
//        },
        parse: function(response) {
            return response;
        }
    });

    var BoardView = Backbone.View.extend({
        initialize: function(){
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },
        tagName: "li",
        className: "list-group-item",
        template: _.template('<p><strong><%=title%></strong></p><span><%=writer%> | <%=insertDateTime%></span>'),
        render: function(){
            this.$el.html(this.template(this.model.attributes));
            this.$el.data('id', this.model.get('id'));
            return this;
        },
        remove: function(){
            console.log(this.$el);
            this.$el.remove();
        }
    });

     var BoardListView = Backbone.View.extend({
        initialize: function(){
            this.collection.on('add', this.addOne, this);
            this.collection.on('reset', this.addAll, this);
        },
         events: {
             'click .list-group-item p strong' : 'renderModifiyView'
         },
        tagName: 'ul',
        className: "list-group",
        render: function() {
            this.addAll();
            return this;
        },
        addOne: function(board){
            var boardView = new BoardView({model: board});
            boardView.render();
            this.$el.append(boardView.el);
        },
        addAll: function() {
            this.collection.forEach(this.addOne, this);
        },
        renderModifiyView: function(e){
           var id = $(e.target).parent().parent().data('id');

           var board = new Board({id : id});

           board.fetch({success:function(model){
               $("#updateBoardView").remove();
               $("#boardAppView").append(_.template( $("#updateBoardViewTemplate").html(), model.attributes ));
               $("#updateBoardView").data('id', model.get('id'));
               $("#updateBoardView").modal({backdrop: false});
           }});
        }
    });

    var BoardAppView = Backbone.View.extend({
        events: {
            'click #create' : 'create',
            'click #createBoardView .modal-footer button[name=save]' : 'save',
            'click #createBoardView .modal-footer button[name=close]' : 'close',
            'click #createBoardView .close' : 'close',
            'keypress #boardInsertForm input, textarea' : 'clear',
            'click #updateBoardView .modal-footer button[name=update]' : 'update',
            'click .modal-footer button[name=delete]' : 'delete',
            'click #updateBoardView .modal-footer button[name=close]' : 'close',
            'click #updateBoardView .close' : 'close',
            'keypress #boardInsertForm input, textarea' : 'clear'
        },
        create : function(){
            $('#createBoardView').modal({backdrop: false});
        },
        save : function(e){
           e.preventDefault();
            var baord = new Board({ writer : $('#boardInsertForm').find('input[name=writer]').val(),
                                    title : $('#boardInsertForm').find('input[name=title]').val(),
                                    contents : $('#boardInsertForm').find('textarea[name=contents]').val()});

            if (!baord.isValid()) {
                baord.validationError.forEach(function(element){
                    $('#boardInsertForm').find('*[name=' + element.name + ']').attr('placeholder', element.msg).parent().parent().addClass('has-error');
                });
            } else {
                this.collection.create(baord, {wait:true});
                this.close(e);
            }
        },
        close : function(e){
            $('#' + $(e.target).parent().siblings('.modal-body').find('form').attr('id')).each(function(){
                $(this).find('*[name]').each(function(){
                    $(this).val('');
                    if($(this).parent().parent().hasClass('has-error')) {
                        $(this).attr('placeholder', '').parent().parent().removeClass('has-error');
                    }
                }) ;
            });
            console.log( $('#'+ $(e.target).parent().parent().parent().parent().attr('id')));
            $('#'+ $(e.target).parent().parent().parent().parent().attr('id')).modal('hide');
        },
        clear : function(e){
            var me = $(e.target);
            if(me.parent().parent().hasClass('has-error')) {
                me.attr('placeholder', '').parent().parent().removeClass('has-error');
            }

        },
        update : function(e){
            e.preventDefault();
            var boardList = this.collection.where({ id : $("#updateBoardView").data('id')});
            var me = this;
            boardList.forEach(function(model){
                model.set({ writer : $('#boardUpdateForm').find('input[name=writer]').val(),
                    title : $('#boardUpdateForm').find('input[name=title]').val(),
                    contents : $('#boardUpdateForm').find('textarea[name=contents]').val()});
                if (!model.isValid()) {
                    model.validationError.forEach(function(element){
                        $('#boardUpdateForm').find('*[name=' + element.name + ']').attr('placeholder', element.msg).parent().parent().addClass('has-error');
                    });
                } else {
                    model.save();
                    me.close(e);
                }

            });

        },
        delete :function(e){
            var boardList = this.collection.where({ id : $("#updateBoardView").data('id')});
            boardList.forEach(function(model){
                model.destroy();
            });
            this.close(e);
        }
    });

    var boardList = new BoardList();
    var boardAppView = new BoardAppView ({el : $("#boardAppView"), collection: boardList});
    var boardListView = new BoardListView({ collection: boardList });
    boardList.fetch();
    boardListView.render();
    $('#board-list tbody').remove();
    $('#board-list').append(boardListView.el);
});
