"use strict"

export function checkBorrowDate(request, response, next) {
    let borrowDate = new Date(request.body.borrowDate);
    let currentDate = new Date();
    let maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
    if (borrowDate <= maxDate && borrowDate >= currentDate) {
        return next();
    }
    return response.status(400).json({message : "invalid date"});
}