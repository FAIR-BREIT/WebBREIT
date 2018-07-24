var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'txts/' });
var exec = require('child_process').exec;
var fs = require('fs');

router.post('/', upload.single('txt'), function(req, res, next) {
  var newInputFileName = __dirname + '/../txts/' + req.file.filename + '_' + req.file.originalname;
  var outputDirName = __dirname + '/../results/';

  var breitDir = process.env.BREIT_BINARY_DIR;
  var logAppName = "WebBREIT: ";

  console.log(logAppName + "received a request from: " + req.connection.remoteAddress);
  console.log(logAppName + "(forwarded for: " + req.headers['x-forwarded-for'] + ")");

  var cmdOptions = "";

  if (req.body.analytic) {
    cmdOptions += " --save-analytic ";
  }
  if (req.body.approximation) {
    cmdOptions += " --save-approximation ";
  }
  if (req.body.tabular) {
    cmdOptions += " --save-table ";
  }
  if (req.body.distance) {
    cmdOptions += " --save-distance-to-eq ";
  }
  if (req.body.pdf) {
    cmdOptions += " --save-fig-ne --save-fig-e ";
  }

  fs.rename(
    req.file.path,
    newInputFileName,
    function(error) {
      if (error) {
        res.send({
          error: 'Execution failed.'
        });
        return;
      }

      var cmd = breitDir + '/breit-web.sh --input-file ' + newInputFileName + ' --verbose=NOLOG --output-directory ' + outputDirName + cmdOptions;

      var serverTxtFileName = 'Breit-results-' + req.file.filename + '_' + req.file.originalname;
      var serverPdfNEFileName = 'Breit-results-figure-ne-' + req.file.filename + '_' + req.file.originalname;
      var serverPdfEFileName = 'Breit-results-figure-e-' + req.file.filename + '_' + req.file.originalname;
      var serverRootFileNameNE = 'Breit-results-figure-ne-' + req.file.filename + '_' + req.file.originalname;
      var serverRootFileNameE = 'Breit-results-figure-e-' + req.file.filename + '_' + req.file.originalname;
      serverPdfNEFileName = serverPdfNEFileName.replace('.txt', '.pdf');
      serverPdfEFileName = serverPdfEFileName.replace('.txt', '.pdf');
      serverRootFileNameNE = serverRootFileNameNE.replace('.txt', '.root');
      serverRootFileNameE = serverRootFileNameE.replace('.txt', '.root');

      console.log(logAppName + "executing: " + cmd);

      exec(cmd, function(error, stdout, stderr) {
        // if command execution fails
        if (error) {
          // read the output error file from the process
          fs.readFile(outputDirName + 'breit_log_error.txt', 'utf8', function(err, data) {
            if (err) {
              // if reading of the output file fails, just send dumb error message and return.
              res.send({
                error: "Execution failed.",
                errorFile: ""
              });
              return console.log(err);
            }
            // send the error message and the contents of the output error file.
            res.send({
              error: "Execution failed.",
              errorFile: data
            });
          });
          // print error message to the server console
          console.log('exec error: ' + error);
          // delete the input file
          fs.unlink(newInputFileName, function(err) {
            if (err) {
              throw err;
            }
            console.log(newInputFileName + ' was deleted');
          });
          return;
        }

        var response = {};

        response.resultTxt = serverTxtFileName;
        response.resultNE = serverRootFileNameNE;
        response.resultE = serverRootFileNameE;
        if (req.body.pdf !== undefined) {
          response.resultPdfNE = serverPdfNEFileName;
          response.resultPdfE = serverPdfEFileName;
        }

        res.send(response);

        fs.unlink(newInputFileName);
      });
    }
  );
});

module.exports = router;
