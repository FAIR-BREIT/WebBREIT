$(document).ready(function() {
    function status(message, className) {
        $('#status').html(message);
        $('#status').attr("class", "alert " + className);
    }

    status('Waiting for input.', 'alert-info');

    $('#uploadForm').submit(function(e) {
        e.preventDefault();

        status('Processing...', 'alert-info');

        if ($('#userTxtInput').val() === "") {
            status('<strong>Error: </strong>No file selected!', 'alert-danger');
            return;
        }

        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status, 'alert-danger');
            },

            success: function(response) {
                if (response.error){
                    status('Error: ' + response.error, 'alert-danger');
                    return;
                }

                var resultString = "<strong>Result: </strong>";

                if (response.resultTxt !== undefined && response.resultTxt !== null) {
                    resultString += '<a target="_blank" href="/results/' + response.resultTxt + '">Text</a>';
                    if (response.resultPdfNE !== undefined && response.resultPdfNE !== null) {
                        resultString += ', <a target="_blank" href="/results/' + response.resultPdfNE + '">PDF (non-equilibrium)</a>';
                    }
                    if (response.resultPdfE !== undefined && response.resultPdfE !== null) {
                        resultString += ', <a target="_blank" href="/results/' + response.resultPdfE + '">PDF (equilibrium)</a>';
                    }
                }

                status(resultString,'alert-success');
                $('#canvas-ne').empty();
                $('#canvas-e').empty();
                $('#ne-title').text("non-equilibrium");
                $('#e-title').text("equilibrium");
                runRoot("/results/" + response.resultNE, "c1Dia;1", "canvas-ne");
                runRoot("/results/" + response.resultE, "c1equi;1", "canvas-e");
            }
        });
    });

    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });
});

function runRoot(filename, name, target) {
    JSROOT.OpenFile(filename, function(file) {
        file.ReadObject(name, function(obj) {
            JSROOT.draw(target, obj, "");
        });
    });
}

$(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

