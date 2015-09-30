/**
 * Created by munsif on 30/9/15.
 */

todo = {
    createList: function () {
        todo.list = [];
        localStorage.setItem('todolist', JSON.stringify(todo.list));
        todo.getList();
    },
    addNew: function () {
        var list = {
            taskId: todo.list.length + 1,
            task: $('.task').val(),
            marked: 'pending'
        }
        todo.list.push(list);
        todo.saveItem();
    },
    getList: function () {
        //Sorting Agorithm, // Stackoverflow
        var sort_by = function (field, reverse, primer) {

            var key = primer ?
                function (x) {
                    return primer(x[field])
                } :
                function (x) {
                    return x[field]
                };

            reverse = !reverse ? -1 : 1;

            return function (a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }

        var list = JSON.parse(localStorage.getItem('todolist'));
        list.sort(sort_by('marked', false, function (a) {
            return a.toUpperCase()
        }));

        if (list.length > 0) {
            $('ul.taskLIst').html("");
            var c = -1;
            $.map(list, function (x) {
                c++;
                //console.log(x);
                (x.marked == "done") ? classes = "markDone done fa fa-check" : classes = "markDone";

                var str = $('<li></li>');
                str.append(
                    '<span class = "' + classes + '" data-id = ' + x.taskId + '></span>' +
                    '<p>' + x.task + '</p>' +
                    '<span class="delete fa fa-trash-o" data-id = ' + c + '></span>' +
                    '</li>');
                $('ul.taskLIst').append(str);

            });
        }
        else {
            $('ul.taskLIst').html("");
            //alert("Create a task");
        }
    },
    saveItem: function () {
        localStorage.setItem('todolist', JSON.stringify(todo.list));
    },
    completedItem: function (taskId) {
        //var list = JSON.parse(localStorage.getItem('todolist'));
        $.each(todo.list, function (x, y) {
            if (y.taskId == taskId) {
                this.marked = "done";
                return false;
            }
            else {
                return;
            }
        });
        console.log(todo.list);
        todo.saveItem();
        todo.getList();
    },
    uncompletedItem: function (taskId) {
        $.each(todo.list, function (x, y) {
            if (y.taskId == taskId) {
                this.marked = "pending";
                return false;
            }
            else {
                return;
            }
        });
        console.log(todo.list);
        todo.saveItem();
        todo.getList();
    },
    deleteItem: function (task) {
        todo.list.splice(task, 1);
        todo.saveItem();
    },
    markItem: function () {
        $('.mainWrapper').on('click', '.markDone', function (e) {
            var id = $(this).data("id");
            if ($(this).hasClass("done")) {
                $(this).removeClass("done");
                todo.uncompletedItem(id)
            }
            else {
                $(this).addClass("done");
                todo.completedItem(id)
            }
            e.stopImmediatePropagation();
        });
    }
}

//Create List
todo.createList();

$('button.addNew').click(function () {
    if ($('.task').val() == null || $('.task').val() == "") {
        alert("Please give task a name and click Add");
    }
    else {
        todo.addNew();
        todo.markItem();
        todo.getList();
        //Empty the Field
        $('.task').val("");
    }
});

//Enter to Add
$('.task').keyup(function(event){
    if(event.keyCode == 13){
        $('button.addNew').click();
    }
});

//Delete Item
$('.mainWrapper').on('click', '.delete',function () {
    //var index = $(this).parent().parent().children().index($(this).parent());
    var index = parseInt($(this).data("id"),10);
    console.log($(this).data("id"));
    todo.deleteItem();
    todo.getList();
});