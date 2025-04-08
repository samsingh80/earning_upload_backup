/**
 * The custom logic to handle file upload for the EarningFiles entity, ensuring the data is processed and stored in the HANA database.
 * @On(event = { "upload" }, entity = "earning_uploadSrv.EarningFiles")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
    const { EarningFiles } = cds.entities;

    // Extract data from the request
    const { bank, year, quarter, file } = request.data;

    // Check if the required data is provided
    if (!bank || !year || !quarter || !file) {
        return request.reject(400, 'Missing required data for file upload.');
    }

    // Prepare the data to be inserted
    const newEarningFile = {
        bank,
        year,
        quarter,
        file
    };

    // Insert the new record into the EarningFiles entity
    await INSERT.into(EarningFiles).columns('bank', 'year', 'quarter', 'file').values(bank, year, quarter, file);

    // Return a success message
    return { message: 'File uploaded and data stored successfully.' };
}
