/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, ScenarioQuestion } from '../types';

export const SEED_QUESTIONS: Question[] = [
  // --- NHÓM 1: QUY ĐỊNH PHÁP LUẬT VỀ AN TOÀN THÔNG TIN ---
  {
    id: "law_1",
    category: "law",
    questionText: "Theo Luật An toàn thông tin mạng 2015, cơ quan nào chịu trách nhiệm quản lý nhà nước về an toàn thông tin mạng trên phạm vi cả nước?",
    choices: [
      { id: "A", text: "Bộ Thông tin và Truyền thông." },
      { id: "B", text: "Bộ Công an." },
      { id: "C", text: "Bộ Quốc phòng." },
      { id: "D", text: "Ủy ban nhân dân cấp Tỉnh dại diện." }
    ],
    correctAnswerId: "A",
    difficulty: "easy",
    explanation: "Bộ Thông tin và Truyền thông chịu trách nhiệm trước Chính phủ thực hiện quản lý nhà nước về an toàn thông tin mạng trên phạm vi cả nước."
  },
  {
    id: "law_2",
    category: "law",
    questionText: "Nghị định 53/2022/NĐ-CP chi tiết hóa một số điều của Luật nào sau đây?",
    choices: [
      { id: "A", text: "Luật An toàn thông tin mạng 2015." },
      { id: "B", text: "Luật An ninh mạng 2018." },
      { id: "C", text: "Luật Giao dịch điện tử 2023." },
      { id: "D", text: "Bộ luật Hình sự năm 2015." }
    ],
    correctAnswerId: "B",
    difficulty: "medium",
    explanation: "Nghị định số 53/2022/NĐ-CP của Chính phủ quy định chi tiết một số điều của Luật An ninh mạng năm 2018."
  },
  {
    id: "law_3",
    category: "law",
    questionText: "Hành vi nào dưới đây bị nghiêm cấm theo quy định của pháp luật về an toàn thông tin mạng?",
    choices: [
      { id: "A", text: "Cài đặt phần mềm diệt virus bản quyền trên máy tính công sở." },
      { id: "B", text: "Phát tán phần mềm độc hại, virus qua mạng nội bộ hoặc lên Trang thông tin điện tử của cơ quan nhà nước." },
      { id: "C", text: "Cập nhật bản vá hệ điều hành Windows thường xuyên." },
      { id: "D", text: "Sử dụng chữ ký số công vụ để phê duyệt văn bản đi." }
    ],
    correctAnswerId: "B",
    difficulty: "easy",
    explanation: "Phát tán mã độc, virus là hành vi phá hoại tài nguyên thông tin, bị phạt tiền nghiêm trọng và truy cứu trách nhiệm hình sự."
  },
  {
    id: "law_4",
    category: "law",
    questionText: "Theo quy chuẩn an toàn thông tin, cấp độ bảo mật của Hệ thống thông tin điện tử một cửa của Ủy ban nhân dân cấp cấp xã, phường thông thường được xác định là cấp độ mấy?",
    choices: [
      { id: "A", text: "Cấp độ 1." },
      { id: "B", text: "Cấp độ 2." },
      { id: "C", text: "Cấp độ 3." },
      { id: "D", text: "Cấp độ 4 hoặc 5." }
    ],
    correctAnswerId: "B",
    difficulty: "medium",
    explanation: "Hệ thống thông tin giải quyết thủ tục hành chính cấp huyện/xã, trang thông tin diện tử của UBND đa số được đề xuất cấp độ 2."
  },
  {
    id: "law_5",
    category: "law",
    questionText: "Theo thông tư của cơ quan quản lý chuyên ngành, khi phát hiện sự cố mất an toàn thông tin tại đơn vị xã, công chức chuyên trách phải báo cáo khẩn cấp đến đơn vị nào trong vòng 24 giờ?",
    choices: [
      { id: "A", text: "Trung tâm Ứng cứu khẩn cấp máy tính Việt Nam (VNCERT) hoặc Đội ứng cứu sự cố tỉnh/thành phố." },
      { id: "B", text: "Ủy ban nhân dân xã đối diện trực tiếp." },
      { id: "C", text: "Đài truyền thanh xã để thông báo." },
      { id: "D", text: "Cửa hàng sửa điện thoại và máy tính ở địa phương." }
    ],
    correctAnswerId: "A",
    difficulty: "hard",
    explanation: "Báo cáo sự cố cần được gửi tới cơ quan chuyên trách như VNCERT hoặc Sở Thông tin và Truyền thông để nhận hỗ trợ xử lý kịp thời, ngăn ngừa lây lan."
  },

  // --- NHÓM 2: SỬ DỤNG MÁY TÍNH AN TOÀN ---
  {
    id: "computer_1",
    category: "computer",
    questionText: "Đâu là nguyên tắc an toàn quan trọng nhất khi sử dụng ổ đĩa USB của cá nhân hoặc công dân mang đến tại bộ phận Một cửa?",
    choices: [
      { id: "A", text: "Cắm ngay vào máy tính làm việc để copy tài liệu cho người dân nhanh chóng." },
      { id: "B", text: "Sử dụng phần mềm diệt virus quét qua ổ USB trước khi mở thư mục bên trong." },
      { id: "C", text: "Chỉ mở các file Word, không kiểm tra định dạng file đuôi .exe hay .scr." },
      { id: "D", text: "Đọc trực tiếp bằng cách click đúp trực tiếp vào thông báo Autorun." }
    ],
    correctAnswerId: "B",
    difficulty: "easy",
    explanation: "Mọi thiết bị lưu trữ ngoại vi phải được quét virus bằng phần mềm chính thống trước khi mở để tránh virus Autorun hoặc mã độc lây nhiễm."
  },
  {
    id: "computer_2",
    category: "computer",
    questionText: "Khi rời khỏi bàn làm việc tại cơ quan xã (kể cả đi ăn trưa hay họp ngắn), công chức cần thao tác gì đầu tiên với máy tính?",
    choices: [
      { id: "A", text: "Tắt màn hình thủ công bằng nút nguồn của góc màn hình." },
      { id: "B", text: "Khóa máy tính ngay lập tức bằng tổ hợp phím Windows + L hoặc tắt nguồn hoàn toàn." },
      { id: "C", text: "Không làm gì vì phòng làm việc luôn có camera an ninh." },
      { id: "D", text: "Tắt mạng dây LAN kết nối máy tính." }
    ],
    correctAnswerId: "B",
    difficulty: "easy",
    explanation: "Tổ hợp phím Windows + L khóa hệ thống nhanh chóng, tránh người lạ hoặc kẻ gian tiếp cận hệ thống dữ liệu công và thay đổi thông tin."
  },
  {
    id: "computer_3",
    category: "computer",
    questionText: "Hệ điều hành Windows báo nhận diện có bản cập nhật mới (Windows Update). Hành vi nào sau đây là đúng về bảo mật?",
    choices: [
      { id: "A", text: "Tắt hoàn toàn tính năng cập nhật vì sợ nặng máy và tốn băng thông internet xã." },
      { id: "B", text: "Thực hiện cập nhật phiên bản vá lỗi bảo mật càng sớm càng tốt bám sát khuyến nghị từ cán bộ CNTT cấp Tỉnh/Huyện." },
      { id: "C", text: "Cài phần mềm bẻ khóa phá bỏ Windows Update." },
      { id: "D", text: "Chờ đến khi máy tính tự hỏng mới cài đặt lại." }
    ],
    correctAnswerId: "B",
    difficulty: "medium",
    explanation: "Cập nhật hệ thống đều đặn giúp vá lỗ hổng zero-day nguy hiểm vốn bị tin tặc khai thác để tấn công tống tiền."
  },
  {
    id: "computer_4",
    category: "computer",
    questionText: "Tại sao không nên cài đặt phần mềm không rõ nguồn gốc (như các phần mềm crack, lậu, bẻ khóa) trên máy tính chuyên dụng của văn phòng Ủy ban nhân dân xã?",
    choices: [
      { id: "A", text: "Vì các phần mềm crack thường chứa mã độc gián điệp, Trojan đánh cắp thông tin bí mật nhà nước." },
      { id: "B", text: "Vì phần mềm crack chiếm quá nhiều dung lượng phần cứng ổ cứng." },
      { id: "C", text: "Vì phần mềm crack làm đổi màu màn hình nền máy tính." },
      { id: "D", text: "Vì phần mềm crack làm tăng lượng điện năng tiêu thụ của máy tính." }
    ],
    correctAnswerId: "A",
    difficulty: "medium",
    explanation: "Phần mềm bẻ khóa bẻ gãy hệ thống kiểm tra bảo mật và có tới trên 90% khả năng kèm mã độc Trojan điều khiển từ xa bí mật."
  },
  {
    id: "computer_5",
    category: "computer",
    questionText: "Khi phát hiện máy tính có hiện tượng lạ: các file biến thành định dạng có đuôi lạ (như .locked, .crypto) và xuất hiện một file hướng dẫn đòi tiền chuộc, công chức nên xử lý như thế nào?",
    choices: [
      { id: "A", text: "Tự ý tải các phần mềm mở khóa trôi nổi trên Google về thử." },
      { id: "B", text: "Rút ngay dây mạng LAN (hoặc tắt ngay Wi-Fi), tắt máy khẩn cấp bằng cách giữ phím nguồn và liên hệ cán bộ kỹ thuật cấp trên." },
      { id: "C", text: "Dùng tài khoản ngân hàng cá nhân nộp tiền ngay để chuộc lại tài liệu của cơ quan xã." },
      { id: "D", text: "Mặc kệ và tiếp tục sử dụng như bình thường." }
    ],
    correctAnswerId: "B",
    difficulty: "hard",
    explanation: "Khi bị dính mã độc mã hóa tống tiền (Ransomware), rút dây mạng lập tức nhằm ngăn chặn mã độc quét và mã hóa các máy tính khác trong mạng LAN của UBND xã."
  },

  // --- NHÓM 3: NHẬN DIỆN LỪA ĐẢO TRỰC TUYẾN ---
  {
    id: "phishing_1",
    category: "phishing",
    questionText: "Bạn nhận được một email từ hòm thư có địa chỉ 'ubnd-tinh.gov.vn@gmail.com' thông báo bổ sung hồ sơ gấp để thanh tra công vụ. Bạn nhận định email này thế nào?",
    choices: [
      { id: "A", text: "Email rất tin cậy vì có phần đuôi ubdnd-tinh.gov.vn ở phía trước." },
      { id: "B", text: "Email giả mạo mạo danh vì cơ quan nhà nước sử dụng hệ thống thư công vụ có đuôi bắt buộc duy nhất là '.gov.vn' chứ không sử dụng dịch vụ Gmail miễn phí." },
      { id: "C", text: "Email thực vì Gmail là phần mềm thư điện tử tốt hàng đầu thế giới hiện nay." },
      { id: "D", text: "Có thể tin cậy nếu có đóng dấu đỏ ở tệp đính kèm đi cùng." }
    ],
    correctAnswerId: "B",
    difficulty: "easy",
    explanation: "Cơ quan nhà nước đồng bộ sử dụng tệp đuôi miền chính thống dạng @[tinh].gov.vn. Hòm thư dạng @gmail.com là mạo danh."
  },
  {
    id: "phishing_2",
    category: "phishing",
    questionText: "Kẻ lừa đảo trực tuyến tại Việt Nam thường mạo danh cơ quan tư pháp nào để dọa nạt công dân hòng đánh cắp tiền mặt bảo mật?",
    choices: [
      { id: "A", text: "Trung tâm y tế dự phòng." },
      { id: "B", text: "Cơ quan Công an, Viện kiểm sát hoặc Tòa án gọi điện đe dọa liên quan tới án mạng hoặc rửa tiền." },
      { id: "C", text: "Sở Tư pháp địa phương cấp lại hộ tịch." },
      { id: "D", text: "Công ty xổ số kiến thiết quốc gia." }
    ],
    correctAnswerId: "B",
    difficulty: "easy",
    explanation: "Chiêu trò cũ nhưng cực hiệu quả là giả danh công an, viện kiểm sát dọa nạn nạn nhân gửi tiền để kiểm tra dòng tiền phi pháp."
  },
  {
    id: "phishing_3",
    category: "phishing",
    questionText: "Một công dân gửi một đường link yêu cầu bạn bấm vào để 'xác minh căn cước công dân trực tuyến' nhằm sửa lỗi dữ liệu hộ tịch qua Zalo cán bộ hộ tịch. Điều gì bạn cần làm?",
    choices: [
      { id: "A", text: "Bấm ngay để xem họ gặp lỗi gì và hỗ trợ nhanh nhất có thể." },
      { id: "B", text: "Cảnh giác, tuyệt đối không click vào link không rõ nguồn gốc. Yêu cầu công dân thao tác trực tiếp trên Cổng dịch vụ công Quốc gia." },
      { id: "C", text: "Chia sẻ đường link này vào group nội bộ của UBND xã để mọi người cùng xem." },
      { id: "D", text: "Cung cấp cả tài khoản công vụ cho công dân để họ tự đăng nhập sửa." }
    ],
    correctAnswerId: "B",
    difficulty: "medium",
    explanation: "Các liên kết ngoài không chính thống thường chứa mã khai thác lỗ hổng trình duyệt hoặc trang web phishing câu kéo tài khoản."
  },
  {
    id: "phishing_4",
    category: "phishing",
    questionText: "Đâu là dấu hiệu nhận biết của một trang web bán vé tàu / dịch vụ hành chính công giả mạo lừa đảo sinh viên và người dân ở nông thôn?",
    choices: [
      { id: "A", text: "Có chứng chỉ bảo mật HTTPS (ổ khóa) nhưng tên miền sai lệch chi tiết: vd: 'dichvucong-gov-vn.xyz' hoặc sử dụng các tên miền quốc tế miễn phí." },
      { id: "B", text: "Giao diện hiển thị sắc nét bằng tiếng Việt." },
      { id: "C", text: "Có đầy đủ số điện thoại hotline hỗ trợ và địa chỉ thật." },
      { id: "D", text: "Trang web bắt buộc đăng nhập bằng ID định danh quốc gia VNeID." }
    ],
    correctAnswerId: "A",
    difficulty: "medium",
    explanation: "Tên miền lừa đảo thường cố mạo danh cấu trúc tên miền đúng nhưng chèn thêm dấu gạch ngang hoặc sử dụng đuôi .cc, .xyz, .top thay vì .gov.vn."
  },
  {
    id: "phishing_5",
    category: "phishing",
    questionText: "Phương thức tấn công lừa đảo 'Smishing' là gì?",
    choices: [
      { id: "A", text: "Mạo danh để gửi tin nhắn văn bản SMS chứa mã độc hoặc liên kết lừa đảo hòng chiếm quyền kiểm soát điện thoại của nạn nhân." },
      { id: "B", text: "Gọi điện thoại trực tiếp bằng giọng nói trí tuệ nhân tạo Deepfake." },
      { id: "C", text: "Tấn công mạng vào hệ thống máy chủ cơ quan hành chính qua cổng vật lý." },
      { id: "D", text: "Gửi thư tay có tẩm hóa chất độc hại bám lấy da." }
    ],
    correctAnswerId: "A",
    difficulty: "hard",
    explanation: "Smishing = SMS + Phishing. Lừa đảo qua tin nhắn văn bản, thường là tin nhắn ngân hàng giả hoặc tin nhắn mạo danh thông báo lỗi của Cơ quan thuế."
  },

  // --- NHÓM 4: QUẢN LÝ TÀI KHOẢN SỐ ---
  {
    id: "account_1",
    category: "account",
    questionText: "Mật khẩu nào sau đây được đánh giá là an toàn nhất cho tài khoản hệ thống một cửa điện tử của cán bộ xã?",
    choices: [
      { id: "A", text: "123456AbCd!@#vnd" },
      { id: "B", text: "cb_ubnd_xa_2026" },
      { id: "C", text: "AnToanThongTin2026!#Commune" },
      { id: "D", text: "tranthihoa_hotocth_1990" }
    ],
    correctAnswerId: "C",
    difficulty: "easy",
    explanation: "Mật khẩu an toàn phải có độ dài tối thiểu 12 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt và không chứa thông tin cá nhân dễ đoán."
  },
  {
    id: "account_2",
    category: "account",
    questionText: "Cơ chế bảo mật 'Xác thực đa yếu tố' (MFA/2FA) mang lại lợi ích gì?",
    choices: [
      { id: "A", text: "Giúp người dùng đăng nhập nhanh hơn, không cần nhập mật khẩu chính." },
      { id: "B", text: "Thêm một lớp bảo vệ bên cạnh mật khẩu tĩnh. Khi lộ mật khẩu, tin tặc vẫn không thể truy cập nếu không có mã OTP tạm thời." },
      { id: "C", text: "Tự động gửi thông tin cá nhân lên hệ thống bảo mật đám mây của tỉnh." },
      { id: "D", text: "Dành riêng cho các máy tính chuyên dụng có quét vân tay." }
    ],
    correctAnswerId: "B",
    difficulty: "easy",
    explanation: "MFA buộc người dùng cung cấp thêm một minh chứng sở hữu thứ hai (như OTP từ điện thoại) để xác minh, vô hiệu hóa việc mất mật khẩu đơn thuần."
  },
  {
    id: "account_3",
    category: "account",
    questionText: "Bạn phát hiện mật mã tài khoản Gmail công vụ của mình vô tình được viết lên tờ nhớ dán dưới bàn phím của một thực tập sinh cũ thiết bị làm việc. Bạn nên làm gì?",
    choices: [
      { id: "A", text: "Vứt tờ giấy đi và tiếp tục sử dụng bình thường vì ít ai lật bàn phím lên xem." },
      { id: "B", text: "Thay đổi mật khẩu tài khoản lập tức, rà soát lại nhật ký đăng nhập và báo cáo quản trị mạng cơ quan." },
      { id: "C", text: "Chụp ảnh tờ giấy lưu trực tiếp trong điện thoại để nhớ mật khẩu phòng hờ quên." },
      { id: "D", text: "Yêu cầu thực tập sinh đó cam kết giữ bí mật giùm." }
    ],
    correctAnswerId: "B",
    difficulty: "medium",
    explanation: "Ghi mật khẩu trên giấy note dán tại bàn làm việc là thói quen xấu cực kỳ mất an toàn. Khi phát hiện sơ hở, mật khẩu phải được thay thế ngay."
  },
  {
    id: "account_4",
    category: "account",
    questionText: "Khi bàn giao tài khoản Hệ thống Quản lý Văn bản và Hồ sơ công việc (Văn bản mật) của xã cho người kế nhiệm, quy trình bảo mật đúng là gì?",
    choices: [
      { id: "A", text: "Đưa nguyên mật khẩu cũ cho họ sử dụng trực tiếp tài khoản cũ." },
      { id: "B", text: "Báo cáo cán bộ quản trị hệ thống cấp huyện thu hồi/đóng tài khoản cũ và cấp mới tài khoản định danh riêng biệt cho cán bộ mới." },
      { id: "C", text: "Bỏ không dùng tài khoản đó nữa, tự lập một tài khoản Zalo chung để xử lý văn bản cho tiện lợi." },
      { id: "D", text: "Chia sẻ mật khẩu qua email cá nhân Yahoo hoặc Gmail." }
    ],
    correctAnswerId: "B",
    difficulty: "medium",
    explanation: "Mỗi tài khoản công vụ đại diện cho trách nghiệm pháp lý của một cá nhân cụ thể. Không được chung đụng hay bàn giao ngang mật khẩu."
  },
  {
    id: "account_5",
    category: "account",
    questionText: "Sự nguy hại của lỗ hổng bảo mật 'Credential Stuffing' là gì đối với cán bộ nhà nước?",
    choices: [
      { id: "A", text: "Máy tính tự động nóng lên và bị sập nguồn liên tục khi kết nối." },
      { id: "B", text: "Tin tặc sử dụng danh sách thông tin tài khoản bị lộ ở các web phụ (facebook, diễn đàn nấu ăn...) để thử đăng nhập tự động vào hệ thống công vụ của nhà nước." },
      { id: "C", text: "Đầu đọc mã vạch hoạt động sai chức năng ở bộ phận tiếp nhận hồ sơ hành chính." },
      { id: "D", text: "Hóa đơn tiền điện tử của ủy ban nhân dân bị biến đổi số tiền nợ dòng sản phẩm." }
    ],
    correctAnswerId: "B",
    difficulty: "hard",
    explanation: "Credential Stuffing khai thác thói quen dùng chung một mật khẩu cho nhiều website khác nhau của người dùng để hack hàng loạt."
  },

  // --- NHÓM 5: QUẢN LÝ DỮ LIỆU SỐ ---
  {
    id: "data_1",
    category: "data",
    questionText: "Cán bộ tư pháp xã muốn gửi danh sách họ tên, ngày sinh, số căn cước công dân của 50 hộ dân thuộc diện chính sách sang phòng Lao động Huyện qua internet. Cách nào là an toàn?",
    choices: [
      { id: "A", text: "Đăng công khai lên nhóm Facebook cộng đồng để mọi người tiện tra cứu thông tin." },
      { id: "B", text: "Nén tệp dữ liệu lại, thiết lập mật khẩu bảo mật tệp nén và gửi qua hệ thống e-Office chính thống hoặc phần mềm trao đổi công việc nội bộ được mã hóa." },
      { id: "C", text: "Tải file Excel lên một trang lưu trữ miễn phí trực tuyến không mật khẩu." },
      { id: "D", text: "In ra giấy rồi nhờ một người dân bất kỳ gửi giùm lên huyện." }
    ],
    correctAnswerId: "B",
    difficulty: "easy",
    explanation: "Dữ liệu cá nhân của công dân là thông tin bảo mật nghiêm ngặt. Việc gửi dữ liệu phải thực hiện qua kênh mã hóa, có đặt mật khẩu file phức tạp."
  },
  {
    id: "data_2",
    category: "data",
    questionText: "Quy luật '3-2-1' trong hoạt động sao lưu dữ liệu (backup) hồ sơ địa chính xã là thế nào?",
    choices: [
      { id: "A", text: "3 bản sao lưu, trên ít nhất 2 loại phương tiện lưu trữ khác nhau, và 1 bản lưu trữ ở địa điểm khác bên ngoài cơ quan xã (như ổ đĩa đám mây bảo mật)." },
      { id: "B", text: "Sao lưu trong 3 phút, lặp lại 2 lần một tuần và lưu tại 1 thư mục duy nhất." },
      { id: "C", text: "Cần 3 người ký biên bản xác nhận, sao lưu vào 2 đĩa mềm, lưu trực tiếp tại 1 tủ hồ sơ khóa sắt." },
      { id: "D", text: "Chỉ giữ lại 3 dòng dữ liệu, xóa đi 2 cột, lưu trong vòng 1 năm liên tiếp." }
    ],
    correctAnswerId: "A",
    difficulty: "medium",
    explanation: "Chiến lược 3-2-1 là tiêu chuẩn vàng về quản lý sao lưu bảo vệ dữ liệu khỏi thảm họa cháy nổ hoả hoạn hay mã độc Ransomware."
  },
  {
    id: "data_3",
    category: "data",
    questionText: "Hành động nào dưới đây vi phạm nghiêm trọng Luật An toàn thông tin mạng khi xử lý hồ sơ rác công ích?",
    choices: [
      { id: "A", text: "Mang hồ sơ giấy chứa thông tin cá nhân công dân (CCCD, Sổ hộ khẩu cũ, Bệnh án) vứt trực tiếp vào thùng rác công cộng không qua xé nát." },
      { id: "B", text: "Sử dụng máy hủy giấy chuyên dụng để cắt nhỏ tài liệu trước khi gom phế liệu tái chế." },
      { id: "C", text: "Định dạng trắng hoàn toàn (Format full) ổ cứng máy tính văn phòng cũ trước khi đem trả thanh lý." },
      { id: "D", text: "Mã hóa dữ liệu trước khi gửi trực tuyến qua email nội bộ sở." }
    ],
    correctAnswerId: "A",
    difficulty: "easy",
    explanation: "Hủy tài liệu giấy sai cách tạo cơ hội cho kẻ xấu thu lượm thông tin định danh cá nhân phục vụ lừa đảo tài chính hoặc mạo danh phạm pháp."
  },
  {
    id: "data_4",
    category: "data",
    questionText: "Việc sử dụng Google Drive hoặc các dịch vụ đám mây công cộng cá nhân để lưu trữ tài liệu có nhãn 'MẬT' của chính quyền xã có được phép không?",
    choices: [
      { id: "A", text: "Được phép vì Google Drive rất bảo mật và tiện lợi khi làm việc tại nhà." },
      { id: "B", text: "Tuyệt đối không được phép. Tài liệu mật chỉ được lưu hành, lưu trữ trên hệ thống chuyên dụng nội bộ được nhà nước cấp phép bảo vệ Cơ yếu." },
      { id: "C", text: "Được nếu đã đặt tên file là tệp định dạng không dấu để che mắt tin tặc." },
      { id: "D", text: "Được nếu chia sẻ cho người dân bằng link chỉ xem." }
    ],
    correctAnswerId: "B",
    difficulty: "medium",
    explanation: "Pháp luật quy định nghiêm cấm chuyển tải tệp tin chứa văn bản nhà nước có nhãn mật lên môi trường Internet công cộng, đám mây không được chứng thực an ninh."
  },
  {
    id: "data_5",
    category: "data",
    questionText: "Trường hợp phát hiện một thiết bị máy tính nghiệp vụ địa chính xã đang được cài đặt công cụ chia sẻ tệp 'bittorrent, UTorrent' tải dữ liệu ngang hàng, biện pháp ngăn chặn cần làm?",
    choices: [
      { id: "A", text: "Cho phép chạy tiếp để tải nhanh các tài liệu bản đồ phục vụ công việc." },
      { id: "B", text: "Xóa bỏ ngay các phần mềm chia sẻ ngang hàng (P2P), vì chúng tạo sơ hở cho phép người ngoài internet quét sâu và tải trộm dữ liệu nhạy cảm bên trong máy." },
      { id: "C", text: "Mua thêm card màn hình mạnh để giảm tác động giật lag của mạng internet." },
      { id: "D", text: "Cắm thêm ổ cứng USB ngoài để sao lưu thêm nhanh hơn." }
    ],
    correctAnswerId: "B",
    difficulty: "hard",
    explanation: "Phần mềm chia sẻ ngang hàng P2P không được kiểm soát có thể chia sẻ nhầm hoặc bị lợi dụng rà quét để lộ toàn bộ thư mục dữ liệu nghiệp vụ của Uỷ ban nhân dân xã."
  }
];

export const SEED_SCENARIOS: ScenarioQuestion[] = [
  // TÌNH HUỐNG 1: Email giả mạo Bộ Nội vụ
  {
    id: "scenario_1",
    topic: "Email giả mạo",
    scenarioText: "Vào đầu buổi sáng, hòm thư của Văn phòng UBND xã nhận được một email từ hòm thư 'bongoivu.gov.vn@outlook.com' với định dạng tiêu đề 'HỎA TỐC: Báo cáo nhân sự chuyển đổi số phục vụ thanh tra cơ quan'. Email yêu cầu cán bộ tải tệp tin đính kèm có đuôi 'BaoCao_BoNoiVu_Update_2026.zip', giải nén và mở tệp '.exe' bên trong để hoàn tất điền số liệu của đơn vị.",
    step1: {
      prompt: "Bước 1: Em hãy xác định nguy cơ bảo mật lớn nhất trong tình huống này là gì?",
      choices: [
        { id: "A", text: "Nguy cơ email chứa virus/mã độc gián điệp nhằm kiểm soát máy tính, rò rỉ dữ liệu hoặc mã cấu trúc cơ quan xã." },
        { id: "B", text: "Nguy cơ email spam gây đầy dung lượng hòm thư công vụ của cơ quan xã." },
        { id: "C", text: "Nguy cơ mất an toàn giao thông đô thị nơi công tác." },
        { id: "D", text: "Nguy cơ chậm nộp báo cáo dẫn đến bị kỷ luật từ Lãnh đạo uỷ ban huyện." }
      ],
      correctAnswerId: "A"
    },
    step2: {
      prompt: "Bước 2: Phương án xử lý tối ưu và an toàn nhất nào cần thực hiện?",
      choices: [
        { id: "A", text: "Tải ngay tệp đính kèm về giải nén để hoàn thành báo cáo hỏa tốc cho Bộ Nội vụ đúng giờ." },
        { id: "B", text: "Tuyệt đối không tải tệp đính kèm, không click link. Khẩn trương gọi điện thoại xác minh qua số hotline chính thức của phòng Nội vụ huyện hoặc Bộ Nội vụ, đồng thời báo cáo cán bộ kỹ thuật Công nghệ thông tin." },
        { id: "C", text: "Chuyển tiếp (forward) toàn bộ email này sang các hòm thư khác trong cơ quan xã để hỏi ý kiến các đồng nghiệp." },
        { id: "D", text: "Xóa bỏ email ngay lập tức và giữ im lặng không nói với ai để tránh gây hoang mang dư luận." }
      ],
      correctAnswerId: "B"
    },
    step3: {
      prompt: "Bước 3: Hãy lựa chọn lý do thích đáng nhất giải thích cho hành động của bạn?",
      choices: [
        { id: "A", text: "Dấu hiệu giả mạo rõ rệt từ địa chỉ hòm thư (@outlook.com là dịch vụ thư công cộng, không phải đuôi thư nhà nước chính thống @gov.vn). Tệp tin nén chứa file thực thi (.exe) cực kỳ độc hại nguy hiểm." },
        { id: "B", text: "Do cán bộ lười làm báo cáo nên kéo dài thời gian để trì hoãn nhiệm vụ." },
        { id: "C", text: "Bộ Nội vụ không bao giờ yêu cầu gửi báo cáo bằng email mà luôn gửi văn bản giấy chính thức có dán tem." },
        { id: "D", text: "Outlook.com bị chặn kết nối quốc tế bởi các nhà mạng viễn thông Việt Nam." }
      ],
      correctAnswerId: "A"
    },
    explanation: "Hành động mạo danh hòm thư cơ quan Bộ bằng đuôi @outlook.com là thủ đoạn phishing kinh điển. File .exe ẩn trong file nén .zip có khả năng cài đặt Trojan theo dõi bàn phím để ăn cắp tài khoản một cửa của chính uỷ ban."
  },

  // TÌNH HUỐNG 2: USB chứa mã độc tại phòng công chứng Một cửa
  {
    id: "scenario_2",
    topic: "USB nhiễm độc",
    scenarioText: "Một người dân đem theo ổ USB cá nhân đề nghị cán bộ tại Bộ phận Một cửa xã cắm vào máy tính làm việc để copy file ảnh Scan giấy chứng nhận quyền sử dụng đất cũ nhằm bổ sung thủ tục đất đai. Người dân không thạo máy tính và báo USB đang nhờ người khác copy tài liệu tại tiệm Photocopy ngoài cổng xã trước khi mang vào.",
    step1: {
      prompt: "Bước 1: Xác định nguy cơ bảo mật tiềm ẩn trong tình huống cứu tế này?",
      choices: [
        { id: "A", text: "Người dân có thể nhìn trộm màn hình làm việc của cán bộ." },
        { id: "B", text: "USB mang từ tiệm photocopy công cộng rất dễ dính mã độc Autorun, nhiễm virus phá hủy hoặc mã hóa dữ liệu văn phòng xã." },
        { id: "C", text: "USB dung lượng quá nhỏ không copy nổi tệp hình ảnh scan chất lượng cao." },
        { id: "D", text: "USB bị hỏng chân cắm làm gãy lẫy nhựa cổng kết nối vật lý của case máy tính." }
      ],
      correctAnswerId: "B"
    },
    step2: {
      prompt: "Bước 2: Lựa chọn hành vi xử trí đúng đắn nhất bảo đảm an toàn hệ thống?",
      choices: [
        { id: "A", text: "Cắm vào bình thường và click đúp chuột trực tiếp mở nhanh folder cứu nhân sự." },
        { id: "B", text: "Từ chối thẳng thừng, gạt bỏ và đuổi người dân ra ngoài không tiếp nhận bổ sung hồ sơ." },
        { id: "C", text: "Cắm USB vào máy tính chuyên dụng có trang bị phần mềm diệt virus chính hiệu (như Kaspersky, Bkav Pro); thực hiện quét virus toàn diện ổ USB trước khi thao tác mở lấy tài liệu dạng ảnh. Nếu có hệ thống máy tính cách ly riêng biệt thì ưu tiên sử dụng máy này." },
        { id: "D", text: "Đề nghị người dân tự dùng điện thoại thông minh chụp lại hình ảnh rồi tháo thẻ nhớ cắm trực tiếp vào máy tính cơ quan xã." }
      ],
      correctAnswerId: "C"
    },
    step3: {
      prompt: "Bước 3: Cơ sở khóa an toàn đằng sau biện pháp xử lý đã chọn là gì?",
      choices: [
        { id: "A", text: "Các tiệm photo công cộng là mầm mống lây lan virus hàng đầu. Quét virus giúp dẹp bỏ nguy cơ lây lan mã độc vào hệ thống mạng nội bộ LAN của ỦY ban nhân dân để từ đó xâm nhập hệ thống Huyện Tỉnh." },
        { id: "B", text: "Để tiết kiệm thời gian sửa chữa phần cứng của máy tính công sở xã." },
        { id: "C", text: "Chứng minh cán bộ Một cửa có kỹ năng máy vi tính đỉnh cao hơn người dân bình thường." },
        { id: "D", text: "Để có lý do thu thêm lệ phí kiểm tra virus đối với công dân địa phương." }
      ],
      correctAnswerId: "A"
    },
    explanation: "USB trung chuyển từ những môi trường không kiểm chứng là nguồn phát tán mã độc khổng lồ. Thiết lập cơ chế quét virus tự động ngăn ngừa hiệu quả virus làm mất mát hồ sơ số hộ tịch."
  },

  // TÌNH HUỐNG 3: Chia sẻ tài liệu nhạy cảm qua mạng xã hội (Zalo)
  {
    id: "scenario_3",
    topic: "Chia sẻ dữ liệu sai quy định",
    scenarioText: "Để phối hợp nhanh cho lịch giải phóng mặt bằng, một cán bộ Địa chính và Xây dựng xã đã tạo một nhóm chat Zalo công khai bao gồm một số người dân bị ảnh hưởng và gửi trực tiếp văn bản Excel lập danh sách chi tiết chi trả đền bù đất đai (trong tài liệu ghi rõ tên tuổi, năm sinh, địa chỉ, số CMND, số điện thoại, số tài khoản ngân hàng và mức tiền dự toán đền bù cụ thể của từng hộ dân).",
    step1: {
      prompt: "Bước 1: Hãy chỉ ra điểm cực kỳ mất an toàn thông tin rò rỉ dữ liệu trong tình huống trên?",
      choices: [
        { id: "A", text: "Tiết lộ toàn bộ thông tin cá nhân bảo mật (PII) của công dân ra nhóm công khai trên Internet, vi phạm quy định về bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP." },
        { id: "B", text: "Zalo tốn dung lượng lưu trữ trên các thiết bị di động của bà con địa phương." },
        { id: "C", text: "Danh sách này có thể thiếu tên một số người dân thuộc diện vắng mặt." },
        { id: "D", text: "Văn bản chưa có chữ ký số của Chủ tịch Ủy ban nhân dân xã thừa lệnh." }
      ],
      correctAnswerId: "A"
    },
    step2: {
      prompt: "Bước 2: Cách khắc phục khẩn cấp và thiết lập quy trình chuẩn đúng đắn là gì?",
      choices: [
        { id: "A", text: "Kệ như vậy để mọi người tự bàn luận cho có không khí dân chủ cơ sở." },
        { id: "B", text: "Thu hồi gấp file dữ liệu, xóa sạch tệp tin rò rỉ khỏi nhóm chat ngay. Chuyển sang hình thức công khai niêm yết có kiểm soát tại trụ sở UBND xã hoặc lập danh sách tra cứu gửi riêng trực tiếp cho từng hộ công dân liên quan, tuyệt đối không đăng tải chéo lẫn nhau." },
        { id: "C", text: "Yêu cầu tất cả thành viên trong nhóm Zalo cam kết không được chia sẻ file Excel này ra ngoài rồi tiếp tục để file trên nhóm." },
        { id: "D", text: "Chuyển file Excel đó thành tệp PDF để người khác không thể copy được chữ số." }
      ],
      correctAnswerId: "B"
    },
    step3: {
      prompt: "Bước 3: Việc bảo mật thông tin định danh công dân là cốt lõi vì lý do gì?",
      choices: [
        { id: "A", text: "Để bảo vệ thông tin mật, tránh trường hợp các đối tượng lừa đảo lợi dụng thông tin đền bù, số điện thoại, CMND để tiếp cận lôi kéo lừa gạt tiền bạc hay tống tiền bà con nông thôn nhẹ dạ." },
        { id: "B", text: "Để người dân không so sánh mức đền bù giải phóng mặt bằng giữa hộ này với hộ kia gây khiếu kiện." },
        { id: "C", text: "Tránh việc các ứng dụng nhắn tin miễn phí làm giảm sút chất lượng ảnh chụp chứng thư." },
        { id: "D", text: "Cắt giảm tối đa lưu lượng dữ liệu kết nối quốc tế của nhà mạng." }
      ],
      correctAnswerId: "A"
    },
    explanation: "Thông tin cá nhân bị lộ là miếng mồi béo bở cho các tổ chức lừa đảo trực tuyến tại Việt Nam xây dựng kịch bản scam chính xác nhằm thao túng tâm lý nạn nhân."
  }
];
