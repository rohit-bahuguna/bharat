import { useState } from 'react';
import Dropzone from 'react-dropzone';
import React from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { updateClassFromCsv } from '../../../redux/feateres/classSlice';
import { createClassesFromCSV } from '../../../utils/API/class_API';

const DropZone = ({ toggleCsvForm }) => {
	const [file, setFiles] = useState();
	const [fileName, setFileName] = useState('');
	const handleDropChange = acceptedFiles => {
		setFileName(acceptedFiles[0].path);

		setFiles(acceptedFiles[0]);
	};

	const dispatch = useDispatch();

	const uploadFromCsv = async () => {
		if (file) {
			try {
				const { data } = await createClassesFromCSV(file);
				console.log(data);
				dispatch(updateClassFromCsv(data.classes));
				toggleCsvForm();
			} catch (error) {
				console.log(error);
			}
		} else {
			alert('please provide a file');
		}
	};

	return (
		<Dropzone onDrop={acceptedFiles => handleDropChange(acceptedFiles)}>
			{({ getRootProps, getInputProps }) =>
				<section>
					{fileName === ''
						? <div
								{...getRootProps()}
								className="dropzone upload-zone dz-clickable">
								<input {...getInputProps()} />

								<div className="dz-message">
									<span className="dz-message-text">Drag and drop file</span>
									<span className="dz-message-or">or</span>
									<Button color="primary">SELECT</Button>
								</div>
							</div>
						: <div className="dz-message">
								<span className="dz-message-text h1-fs">
									{fileName}
								</span>

								<Button onClick={uploadFromCsv} className="mt-3">
									Upload Data on Calender
								</Button>
							</div>}
				</section>}
		</Dropzone>
	);
};

export default DropZone;
