export class DateUtil {

    /**
     * 
     * @param params string tanggal = "2024-12-27" | objek Date = new Date("2024-12-27") | dengan timestamp (number) = 1703635200000
     * @returns Output: 20/12/2024, 14.39.29
     */
    static formatToJakartaTime(params:string | number | Date):string {
        const localDateTime = new Date(params).toLocaleDateString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })

        return localDateTime
    }

    /**
     * 
     * @param params string tanggal = "2024-12-27" | objek Date = new Date("2024-12-27") | dengan timestamp (number) = 1703635200000
     * @returns Output: 20 Desember 2024 pukul 14.39.29
     */
    static formatIndonesianDate(params:string | number | Date):string {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };

        const formatter = new Intl.DateTimeFormat("id-ID", options);

        return formatter.format(new Date(params));
    }

    /**
     * 
     * @param params format Date format = 02/02/2000
     * @returns Output: 20 December 2024
     */
    static convertDateToEnglishFormat(params: string): string {
        const [dateStr, monthStr, yearsStr] = params.split('/');
      
        // Pastikan bahwa tanggal, bulan, dan tahun valid
        if (!dateStr || !monthStr || !yearsStr) {
          throw new Error("Format tanggal tidak valid. Gunakan format DD/MM/YYYY.");
        }
      
        const monthName: string[] = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      
        const bulanIndex = parseInt(monthStr, 10) - 1;
        if (bulanIndex < 0 || bulanIndex >= 12) {
          throw new Error("Bulan tidak valid. Harus antara 01 dan 12.");
        }
      
        const bulan = monthName[bulanIndex];

        const tanggalHasil = `${dateStr} ${bulan} ${yearsStr}`;
      
        return tanggalHasil;
    }

    /**
     * 
     * @returns Output: 2024-12-27
     */
    static getTodayFormattedDate(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        const formattedDate = `${year}-${month}-${day}`; // format yyyy-mm-dd

        return formattedDate;
    }
    
    /**
     * 
     * @param dateParams string tanggal = "2024-12-27" | objek Date = new Date("2024-12-27") | dengan timestamp (number) = 1703635200000
     * @param format Opsi untuk memilih format output (YYYY-MM-DD, DD-MM-YYYY, MM-DD-YYYY)
     * @returns Output: 2024-12-27
     */
    static formatDateTime(
        dateParams: string | number | Date,
        format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'YYYY-MM-DD HH:MM:SS' | 'DD/MM/YYYY HH:MM:SS'
      ): string {
        const date = new Date(dateParams);
      
        // Validasi input date
        if (isNaN(date.getTime())) {
          throw new Error("Parameter tidak valid. Pastikan input berupa string, number, atau objek Date yang valid.");
        }
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        // Tentukan format output berdasarkan parameter
        switch (format) {
          case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
          case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
          case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
          case 'YYYY-MM-DD HH:MM:SS':
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          case 'DD/MM/YYYY HH:MM:SS':
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
          default:
            throw new Error("Format tidak valid. Gunakan format yang didukung.");
        }
    }
    
    /**
     * 
     * @param date string tanggal = "2024-12-27" | objek Date = new Date("2024-12-27") | dengan timestamp (number) = 1703635200000
     * @param days Nilai positif untuk menambahkan hari. / Nilai negatif untuk mengurangi hari.
     * @param format Opsi untuk memilih format output (YYYY-MM-DD, DD-MM-YYYY, MM-DD-YYYY) serta Jika tidak diberikan, fungsi mengembalikan objek Date.
     * @returns console.log(modifyDaysOnDate("2024-12-27", 5, 'YYYY-MM-DD')); // Output: "2025-01-01" | console.log(modifyDaysOnDate("2024-12-27", -5, 'YYYY-MM-DD')); // Output: "2024-12-22" | console.log(modifyDaysOnDate("2024-12-27", 10)); // Output: Date object (e.g., 2025-01-06T00:00:00.000Z)
     */
    static modifyDaysOnDate(
        date: string | number | Date,
        days: number,
        format: 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' = 'YYYY-MM-DD'
      ): string | Date {
        const resultDate = new Date(date);
      
        // Validasi input
        if (isNaN(resultDate.getTime())) {
          throw new Error("Parameter 'date' tidak valid. Pastikan input berupa string, number, atau objek Date yang valid.");
        }
      
        // Menambahkan atau mengurangi hari berdasarkan nilai 'days'
        resultDate.setDate(resultDate.getDate() + days);
      
        // Jika tidak membutuhkan format tertentu, kembalikan Date object langsung
        if (!format) {
          return resultDate;
        }
      
        const year = resultDate.getFullYear();
        const month = String(resultDate.getMonth() + 1).padStart(2, '0');
        const day = String(resultDate.getDate()).padStart(2, '0');
      
        // Format tanggal sesuai parameter
        switch (format) {
          case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
          case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
          case 'MM-DD-YYYY':
            return `${month}-${day}-${year}`;
          default:
            throw new Error("Format tidak valid. Gunakan 'YYYY-MM-DD', 'DD-MM-YYYY', atau 'MM-DD-YYYY'.");
        }
    }
    
    /**
     * 
     * @param dateStart string tanggal = "2024-12-27" | objek Date = new Date("2024-12-27") | dengan timestamp (number) = 1703635200000
     * @param dateEnd string tanggal = "2024-12-27" | objek Date = new Date("2024-12-27") | dengan timestamp (number) = 1703635200000
     * @returns Output: 9 | Number
     */
    static calculateDaysBetweenDates(dateStart: string | number | Date, dateEnd: string | number | Date): number {
        // Ubah tanggal menjadi objek Date
        const start = new Date(dateStart);
        const end = new Date(dateEnd);
      
        // Validasi input tanggal
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Parameter 'dateStart' atau 'dateEnd' tidak valid. Pastikan input berupa string, number, atau objek Date yang valid.");
        }
      
        // Hitung selisih dalam milisekon
        const differenceInMilliseconds = end.getTime() - start.getTime();
      
        // Ubah selisih milisekon menjadi jumlah hari
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      
        // Kembalikan jumlah hari (bulatkan ke bawah)
        return Math.floor(differenceInDays);
    }

    /**
     * 
     * @param isoDate string tanggal = 2024-12-27T13:45:00Z | objek Date = new Date()
     * @returns Output: Jumat, 20 Desember 2024 02:39 PM
     */
    static formatISO8601ToReadableDate(isoDate: string | Date): string {
        // Buat objek Date dari tanggal ISO 8601
        const dateObj = new Date(isoDate);
      
        // Validasi tanggal ISO 8601
        if (isNaN(dateObj.getTime())) {
          throw new Error("Parameter 'isoDate' tidak valid. Pastikan menggunakan format ISO 8601 yang benar.");
        }
      
        // Daftar nama-nama hari dalam bahasa Indonesia
        const daysOfWeek = [
          'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
        ];
      
        // Daftar nama-nama bulan dalam bahasa Indonesia
        const monthsOfYear = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
      
        // Ambil nama hari, tanggal, bulan, dan tahun dari objek Date
        const dayName = daysOfWeek[dateObj.getDay()];
        const date = dateObj.getDate();
        const monthName = monthsOfYear[dateObj.getMonth()];
        const year = dateObj.getFullYear();
      
        // Ambil jam, menit, dan detik
        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      
        // Tentukan AM atau PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        // Ubah jam ke format 12 jam
        hours = hours % 12;
        hours = hours ? hours : 12; // Jam 0 menjadi 12
      
        // Format ulang jam dengan leading zero
        const formattedHours = String(hours).padStart(2, '0');
      
        // Format ulang tanggal
        const formattedDate = `${dayName}, ${date} ${monthName} ${year} ${formattedHours}:${minutes} ${ampm}`;
      
        return formattedDate;
    }
}