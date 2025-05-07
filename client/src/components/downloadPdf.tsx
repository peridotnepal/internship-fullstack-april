import axios from 'axios';

const DownloadPdf = async (advisoryContent : string, fileName: string) => {
  try {
    const res = await axios.post('http://localhost:8000/api/download', { advisoryContent, fileName }, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('PDF download error:', err);
  }
}

export default DownloadPdf