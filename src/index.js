const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const {isEmpty, forIn} = require('lodash');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(fileUpload({createParentPath: true}));
app.use('/files', express.static(path.join(__dirname, 'storage')));

const _storageDir = path.join(__dirname, 'storage');

const _setFileName = fileName => {
	const extension = fileName.substr(fileName.lastIndexOf('.')); // > .png
	return `${new Date().getTime()}${extension}`; // > 1246548321.png
};

app.post('/', (req, res) => {
	try {
		const {files} = req;
		if (isEmpty(files)) {
			return res.status(404).json({
				message: 'No files founded',
			});
		}

		let savedFiles = [];
		forIn(files, file => {
			const fileName = _setFileName(file.name);
			file.mv(path.join(_storageDir, fileName));
			savedFiles = [...savedFiles, fileName];
		});
		return res.status(200).json({
			message: 'Arquivo salvo com sucesso',
			data: savedFiles,
		});
	} catch (error) {
		console.log('Error', error);
		return res.status(500).json({message: 'Erro ao tentar salvar arquivo'});
	}
});

app.delete('/:filename', (req, res) => {
	const {filename} = req.params;
	try {
		fs.unlinkSync(path.join(_storageDir, filename));
		return res.status(200).json({message: `Arquivo ${filename} deletado!`});
	} catch (error) {
		console.log('Error', error);
		return res.status(500).json({
			message: `Eror ao deletar arquivo: ${filename}`,
		});
	}
});

app.listen(process.env.PORT || 8080, () => {
	console.log('Storage API listening at 8080');
});
