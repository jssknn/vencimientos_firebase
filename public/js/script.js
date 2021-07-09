$(document).ready(function () {
firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
    //   User is signed in.
        let user = firebase.auth().currentUser;
        let uid
        if(user != null){
            uid = user.uid;
        }

	const db = firebase.firestore();	
    const employeeRef = db.collection("usuarios").doc(uid).collection("vencimientos");
    let deleteIDs = [];
    let lastVisiblevencimientosnapShot = {};

    // GET TOTAL SIZE
    employeeRef.onSnapshot(snapshot => {
        let size = snapshot.size;
        $('.count').text(size);
        if (size == 0) {
            $('#selectAll').attr('disabled', true);
        } else {
            $('#selectAll').attr('disabled', false);
        }
    });


    // REAL TIME LISTENER
    employeeRef.onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {
                renderEmployee(change.doc);
            } else if (change.type == 'modified') {
                $('tr[data-id=' + change.doc.id + ']').remove();
                renderEmployee(change.doc);
            } else if (change.type == 'removed') {
                $('tr[data-id=' + change.doc.id + ']').remove();
            }
        });
        lastVisiblevencimientosnapShot = snapshot.docs[snapshot.docs.length - 1];
    });

    // DISPLAY
    function renderEmployee(document) {
        let item = `<tr data-id="${document.id}">
        <td>${document.data().nombre}</td>
        <td class="visible-md visible-lg" >${document.data().telefono}</td>

        <td class="visible-md visible-lg visible-sm">${document.data().descripcion}</td>
		<td>${document.data().vencimiento}</td>
        <td>
            <a href="#" id="${document.id}" class="edit js-edit-employee"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i>
            </a>
            <a href="#" id="${document.id}" class="delete js-delete-employee"><i class="material-icons" data-toggle="tooltip" title="Eliminar">&#xE872;</i>
            </a>
            <a href="#" id="${document.id}" class="copy js-copy-employee"><i class="material-icons" data-toggle="tooltip" title="Copiar">&#xe39d;</i>
            </a>			
        </td>
    </tr>`;
        $('#employee-table').append(item);
        // Activate tooltip
        $('[data-toggle="tooltip"]').tooltip();
    }

    // ADD EMPLOYEE
    $("#add-employee-form").submit(function (event) {
        event.preventDefault();
        employeeRef.add({
                nombre: $('#employee-nombre').val(),
                telefono: $('#employee-telefono').val(),
                descripcion: $('#employee-descripcion').val(),
				vencimiento: $('#employee-vencimiento').val()
            }).then(function () {
                console.log("Document successfully written!");
                $("#addEmployeeModal").modal('hide');
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    });
	
    $(document).on('click', '.js-copy-employee', function () {
        let id = $(this).attr('id');
        $('#add-employee-form').attr('copy-id', id);
        employeeRef.doc(id).get().then(function (document) {
            if (document.exists) {
                $('#add-employee-form #employee-nombre').val(document.data().nombre);
                $('#add-employee-form #employee-telefono').val(document.data().telefono);
                $('#addEmployeeModal').modal('show');
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    });

    // DELETE EMPLOYEE
    $(document).on('click', '.js-delete-employee', function () {
        let id = $(this).attr('id');
        $('#delete-employee-form').attr('delete-id', id);
        $('#deleteEmployeeModal').modal('show');
    });

    $("#delete-employee-form").submit(function (event) {
        event.preventDefault();
        let id = $(this).attr('delete-id');
        if (id != undefined) {
            employeeRef.doc(id).delete()
                .then(function () {
                    console.log("Document successfully delete!");
                    $("#deleteEmployeeModal").modal('hide');
                })
                .catch(function (error) {
                    console.error("Error deleting document: ", error);
                });
        } else {

        }
    });

    // UPDATE EMPLOYEE
    $(document).on('click', '.js-edit-employee', function () {
        let id = $(this).attr('id');
        $('#edit-employee-form').attr('edit-id', id);
        employeeRef.doc(id).get().then(function (document) {
            if (document.exists) {
                $('#edit-employee-form #employee-nombre-ed').val(document.data().nombre);
                $('#edit-employee-form #employee-telefono-ed').val(document.data().telefono);
                $('#edit-employee-form #employee-descripcion-ed').val(document.data().descripcion);
				$('#edit-employee-form #employee-vencimiento-ed').val(document.data().vencimiento);
                $('#editEmployeeModal').modal('show');
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    });

    $("#edit-employee-form").submit(function (event) {
        event.preventDefault();
        let id = $(this).attr('edit-id');
        employeeRef.doc(id).update({
            nombre: $('#edit-employee-form #employee-nombre-ed').val(),
            telefono: $('#edit-employee-form #employee-telefono-ed').val(),
            descripcion: $('#edit-employee-form  #employee-descripcion-ed').val(),
			vencimiento: $('#edit-employee-form  #employee-vencimiento-ed').val()
        });
        $('#editEmployeeModal').modal('hide');
    });
	
	// UPDATE DATOS
	var myEl = document.getElementById('js-edit-employee-2');

    myEl.addEventListener('click', function() {
        db.collection("usuarios").doc(uid).get().then(function (document) {
			console.log('click');
            if (document.exists) {
				console.log('click2');
                $('#edit-employee-form2 #employee-nombre2').val(document.data().nombre);
                $('#edit-employee-form2 #employee-telefono2').val(document.data().telefono);
                $('#edit-employee-form2 #employee-elemento2').val(document.data().elemento);
                $('#EditEmployeeModal2').modal('show');
				
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    });

    $("#edit-employee-form2").submit(function (event) {
        event.preventDefault();
        db.collection("usuarios").doc(uid).update({
            nombre: $('#edit-employee-form2 #employee-nombre2').val(),
            telefono: $('#edit-employee-form2 #employee-telefono2').val(),
            elemento: $('#edit-employee-form2 #employee-elemento2').val()
        });
        $('#EditEmployeeModal2').modal('hide');
    });

    $("#addEmployeeModal").on('hidden.bs.modal', function () {
        $('#add-employee-form .form-control').val('');
    });

    $("#editEmployeeModal").on('hidden.bs.modal', function () {
        $('#edit-employee-form .form-control').val('');
    });
	
    } else {
    window.location.replace("index.html")
    }
});	
});

// CENTER MODAL
(function ($) {
    "use strict";

    function centerModal() {
        $(this).css('display', 'block');
        var $dialog = $(this).find(".modal-dialog"),
            offset = ($(window).height() - $dialog.height()) / 2,
            bottomMargin = parseInt($dialog.css('marginBottom'), 10);

        // Make sure you don't hide the top part of the modal w/ a negative margin if it's longer than the screen height, and keep the margin equal to the bottom margin of the modal
        if (offset < bottomMargin) offset = bottomMargin;
        $dialog.css("margin-top", offset);
    }

    $(document).on('show.bs.modal', '.modal', centerModal);
    $(window).on("resize", function () {
        $('.modal:visible').each(centerModal);
    });
}(jQuery));