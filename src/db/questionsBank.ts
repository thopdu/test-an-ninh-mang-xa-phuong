/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, ScenarioQuestion } from '../types';

const RAW_MCQ_DATA = [
  // ===== CHỦ ĐỀ 1: QUY ĐỊNH PHÁP LUẬT – TẠI SAO & LÝ DO =====
  {
    id: 1,
    topic: "quydinh",
    text: "Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, tại sao công chức phải bảo mật nghiêm ngặt hồ sơ công dân (CCCD, địa chỉ, số điện thoại) thay vì tự ý chia sẻ để giải quyết công việc hành chính nhanh hơn?",
    opts: [
      "A. Vì đây là trách nhiệm pháp lý bắt buộc đối với Bên Kiểm soát và xử lý dữ liệu; chia sẻ tùy ý không đúng quy trình là hành vi vi phạm pháp luật và xâm phạm trực tiếp quyền riêng tư của công dân.",
      "B. Vì các hệ thống của cơ quan nhà nước không đủ dung lượng để chứa dữ liệu nếu bị tải lên chia sẻ liên tục.",
      "C. Vì chia sẻ thông tin công dân thì cơ quan sẽ bị các công ty công nghệ lớn điều tra và xử phạt.",
      "D. Vì việc bảo mật dữ liệu là do các ngân hàng liên quan yêu cầu chứ không phải do luật định."
    ],
    ans: 0,
    explanation: "Theo Nghị định 13/2023/NĐ-CP, việc xử lý dữ liệu cá nhân phải tuân thủ nghiêm ngặt các quy định về an toàn thông tin, bảo mật dữ liệu. Công chức khi thừa hành nhiệm vụ xử lý hồ sơ hành chính là đại diện cho Bên Kiểm soát và xử lý dữ liệu, có trách nhiệm pháp lý ngăn chặn việc lộ lọt thông tin cá nhân của công dân."
  },
  {
    id: 2,
    topic: "quydinh",
    text: "Tại sao Nghị định 85/2016/NĐ-CP và Thông tư 12/2022/TT-BTTTT yêu cầu phải 'Phân loại cấp độ bảo đảm an toàn hệ thống thông tin' (từ cấp độ 1 đến cấp độ 5) trong các cơ quan nhà nước?",
    opts: [
      "A. Để tránh áp đặt rập khuôn, giúp cơ quan áp dụng các biện pháp bảo vệ kỹ thuật và tổ chức tương xứng với quy mô, tính chất nhạy cảm và tầm ảnh hưởng của từng hệ thống dữ liệu.",
      "B. Nhằm mục đích phục vụ cho việc tính toán mức áp thuế công nghệ đối với các đơn vị trực thuộc.",
      "C. Nhằm giúp các cơ quan mua sắm toàn bộ các trang thiết bị bảo mật hiện đại nhất cho tất cả các phòng ban cấp xã.",
      "D. Nhằm mục đích phân chia lại biên chế nhân sự CNTT đồng đều giữa các xã."
    ],
    ans: 0,
    explanation: "Việc phân loại hệ thống thông tin theo 5 cấp độ (Nghị định 85/2016/NĐ-CP) giúp tối ưu hóa nguồn lực nhà nước, áp dụng tiêu chuẩn bảo mật chính xác và đầy đủ, tránh thiếu sót an toàn ở hệ thống quan trọng hoặc lãng phí chi phí ở hệ thống đơn giản."
  },
  {
    id: 3,
    topic: "quydinh",
    text: "Tại sao công chức tác nghiệp tại bộ phận Một cửa cấp xã được coi là 'người bảo vệ phòng tuyến đầu tiên' đối với an toàn thông tin mạng của Ủy ban?",
    opts: [
      "A. Vì công chức Một cửa là đối tượng trực tiếp tiếp nhận thông tin, thiết bị (như USB, hồ sơ giấy) bên ngoài từ công dân; nếu lơ là quy chế bảo mật sẽ trực tiếp lây nhiễm mã độc vào toàn bộ intranet cơ quan.",
      "B. Vì họ có tài khoản Quản trị cao cấp nhất (Super Administrator) của hệ thống hành chính công tỉnh.",
      "C. Vì họ có nhiệm vụ tuần tra trực tiếp khu vực đặt máy chủ của Ủy ban nhân dân xã.",
      "D. Vì pháp luật quy định công chức Một cửa là những người duy nhất chịu trách nhiệm thiệt hại mạng."
    ],
    ans: 0,
    explanation: "Trong an ninh mạng, con người vận hành thiết bị đầu cuối luôn là mắt xích dễ bị tổn thương nhất. Công chức Một cửa tiếp xúc trực tiếp với người dân và phương tiện đem từ ngoài vào, do đó giữ vai trò chốt chặn then chốt (phòng tuyến đầu tiên)."
  },
  {
    id: 4,
    topic: "quydinh",
    text: "Cơ sở pháp lý nào quy định chi tiết về các biện pháp bảo vệ an ninh mạng đối với hệ thống thông tin quan trọng về an ninh quốc gia và xử lý các hành vi xâm phạm an ninh mạng tại Việt Nam?",
    opts: [
      "A. Nghị định số 53/2022/NĐ-CP chi tiết hóa Luật An ninh mạng năm 2018.",
      "B. Nghị định số 30/2020/NĐ-CP về công tác văn thư lưu trữ hành chính.",
      "C. Nghị định số 130/2018/NĐ-CP hướng dẫn Luật Giao dịch điện tử.",
      "D. Nghị định số 20/2008/NĐ-CP về tiếp nhận ý kiến cử tri công ích."
    ],
    ans: 0,
    explanation: "Nghị định 53/2022/NĐ-CP là cơ sở pháp lý cực kỳ quan trọng hướng dẫn cụ thể việc thi hành một số điều của Luật An ninh mạng 2018, quy định các biện pháp nghiệp vụ bảo vệ, kiểm tra an ninh mạng và điều kiện bảo đảm lực lượng an ninh mạng."
  },
  {
    id: 5,
    topic: "quydinh",
    text: "Tại sao việc trao đổi văn bản hành chính, dữ liệu nghiệp vụ nhạy cảm giữa các cơ quan Đảng và Nhà nước bắt buộc phải sử dụng 'Mạng truyền số liệu chuyên dùng' (mạng riêng chuyên dùng của Đảng, Nhà nước) thay vì mạng Internet thông thường?",
    opts: [
      "A. Nhằm tách biệt lưu lượng truyền tải khỏi mạng Internet công cộng, đảm bảo hạ tầng được mã hóa đầu-cuối chuẩn mật mã quốc gia, cách ly vật lý trước sự do thám, tấn công từ bên ngoài.",
      "B. Vì sử dụng mạng truyền số liệu riêng giúp cơ quan không mất chi phí đăng ký thuê bao hàng tháng.",
      "C. Nhằm giúp tốc độ soạn thảo văn bản của các cán bộ, công chức tăng nhanh gấp 10 lần mạng thường.",
      "D. Vì mạng Internet thông thường chỉ dành riêng cho sinh viên học tập, không đủ băng thông truyền file văn bản."
    ],
    ans: 0,
    explanation: "Mạng truyền số liệu chuyên dùng (TSDCD) của các cơ quan Đảng, Nhà nước cung cấp kênh truyền dẫn an toàn, bảo mật cao nhất, tránh rủi ro bị nghe lén, can thiệp hoặc tấn công xâm nhập nhờ cách ly và sử dụng mật mã chuyên ngành."
  },
  {
    id: 6,
    topic: "quydinh",
    text: "Dựa trên Nghị định 30/2020/NĐ-CP về công tác văn thư, tại sao công chức tuyệt đối KHÔNG được gửi văn bản đóng dấu 'MẬT' qua các công cụ trực tuyến công cộng như Zalo, Gmail cá nhân hay Facebook?",
    opts: [
      "A. Vì đây là hành vi tiết lộ bí mật nhà nước quy định tại Luật Bảo vệ bí mật nhà nước; các máy chủ ứng dụng công cộng đặt ở nước ngoài và không được mã hóa, kiểm soát bởi cơ quan an ninh chính thống.",
      "B. Vì các công cụ công cộng này quy định chỉ cho phép gửi tối đa 3 trang giấy của văn bản Mật.",
      "C. Vì sử dụng ứng dụng công cộng sẽ làm giảm uy tín về công nghệ của Ủy ban nhân dân xã sản xuất.",
      "D. Vì các file đính kèm trên Zalo, Facebook sẽ bị tự động dịch chuyển thành tiếng Anh."
    ],
    ans: 0,
    explanation: "Nghị định 30/2020/NĐ-CP quy định rất chặt chẽ quy trình soạn thảo, ký ban hành và chuyển giao văn bản mật. Sử dụng ứng dụng công cộng để gửi tài liệu mật là hành vi vi phạm nghiêm trọng kỷ luật hành chính và pháp luật hình sự về bảo vệ bí mật nhà nước."
  },
  {
    id: 7,
    topic: "quydinh",
    text: "Tại sao pháp luật về an toàn thông tin mạng nghiêm cấm việc lắp đặt thiết bị phát sóng Wi-Fi tự do hoặc tự ý tạo mạng riêng ảo kết nối vào mạng LAN hệ thống nội bộ của Ủy ban nhân dân xã?",
    opts: [
      "A. Vì các thiết bị phát sóng Wi-Fi tự phát không có kiểm soát an ninh, tạo ra 'cổng sau' (backdoor) giúp tin tặc dễ dàng vượt qua tường lửa cơ quan để tấn công sâu vào các cơ sở dữ liệu cốt lõi.",
      "B. Nhằm tiết kiệm tuyệt đối tiền điện tiêu thụ hàng tháng của khối văn phòng hành chính xã.",
      "C. Vì mạng Wi-Fi tự do sẽ phát ra bức xạ làm giảm hiệu suất xử lý của các máy tính nội bộ lân cận.",
      "D. Vì pháp luật cấm sử dụng sóng vô tuyến khi giải quyết thủ tục Một cửa cho nhân dân."
    ],
    ans: 0,
    explanation: "Việc lắp đặt các thiết bị mạng tự phát (Rogue AP) hoặc VPN trái phép phá vỡ vùng biên an ninh (perimeter) mà cơ quan chuyên môn đã thiết lập, vô hiệu hóa các chính sách bảo vệ tường lửa và hệ thống phát hiện xâm nhập (IDS)."
  },
  {
    id: 8,
    topic: "quydinh",
    text: "Căn cứ theo pháp luật về an toàn thông tin, trách nhiệm tự giác nâng cao nhận thức bảo mật của cán bộ công chức mang ý nghĩa gì trong thực tiễn hành chính?",
    opts: [
      "A. Đảm bảo an toàn thông tin không chỉ là trách nhiệm của riêng bộ phận kỹ thuật, mà xuất phát từ ý thức mỗi cá nhân vì một hành vi bất cẩn của một công chức có thể làm sụp đổ toàn bộ hệ thống phối hợp nội bộ.",
      "B. Để giúp giảm bớt số biên chế kỹ sư CNTT bảo trì của huyện nhằm hoàn thành chỉ tiêu cắt giảm nhân lực.",
      "C. Chỉ mang tính hình thức phong trào để cơ quan báo cáo lấy thành tích xếp loại thi đua hàng năm.",
      "D. Để cán bộ tự chịu tiền đền bù thiệt hại tài chính nếu lỡ bấm vào liên kết lừa đảo chiếm đoạt."
    ],
    ans: 0,
    explanation: "An toàn thông tin mạng là một chuỗi mắt xích liên kết, và chuỗi này chỉ mạnh bằng mắt xích yếu nhất. Kẻ tấn công thường nhắm vào các công chức thiếu cảnh giác thay vì nhắm trực tiếp vào hệ thống phòng ngự kỹ thuật kiên cố."
  },
  {
    id: 9,
    topic: "quydinh",
    text: "Theo quy chuẩn kỹ thuật an toàn thông tin, việc 'nhật ký hóa hệ thống' (system logging) được duy trì bắt buộc tại các cơ sở dữ liệu hành chính nhà nước nhằm mục đích pháp lý then chốt nào?",
    opts: [
      "A. Cung cấp bằng chứng số khách quan và không thể chối cãi để điều tra phi vụ truy cập, sửa đổi, rò rỉ dữ liệu trái phép, đồng thời giúp xác định chính xác trách nhiệm công vụ khi xảy ra sự cố.",
      "B. Để kiểm soát chặt chẽ tần suất và hiệu quả gõ bàn phím hàng ngày của từng cán bộ công chức cấp xã.",
      "C. Nhằm mục đích tự động xóa bớt dữ liệu cũ giúp giảm tải dung lượng ổ đĩa của máy chủ tống trữ.",
      "D. Để phục vụ việc chấm điểm kiểm điểm cuối tháng dựa trên số lần đăng nhập phần mềm hành chính."
    ],
    ans: 0,
    explanation: "Nhật ký hệ thống (Logs) ghi lại chính xác lịch sử hoạt động của người dùng, đóng vai trò sống còn trong việc truy vết sự cố, kiểm toán an toàn thông tin và cung cấp chứng cứ số phục vụ công tác điều tra tư pháp."
  },
  {
    id: 10,
    topic: "quydinh",
    text: "Khi một công chức tại cơ quan phát hiện ra tài khoản nghiệp vụ của mình hiển thị lịch sử thay đổi thông tin hộ tịch bất thường không do mình thực hiện, họ có chức trách thực hiện nghĩa vụ nào sau đây đầu tiên?",
    opts: [
      "A. Ngay lập tức đổi mật khẩu tài khoản, báo cáo khẩn cấp cho Bộ phận chuyên trách CNTT/An ninh mạng của đơn vị để cô lập thiết bị, ngăn chặn diễn biến lây lan và truy tìm tài khoản tấn công.",
      "B. Giữ bí mật sự việc để tự theo dõi trong một tuần xem tài khoản có tiếp tục bị thay đổi nữa hay không.",
      "C. Tiếp tục sử dụng bình thường và đổ lỗi cho phần mềm hệ thống bị lỗi hiển thị dữ liệu.",
      "D. Đăng thông báo hỏi cư dân mạng trên Facebook cá nhân để tìm sự trợ giúp từ những người ngoài ngành."
    ],
    ans: 0,
    explanation: "Nhiệm vụ hàng đầu của công chức khi phát hiện sự cố an toàn thông tin là báo cáo ngay lập tức cho tổ chức chuyên trách để kịp thời phong tỏa rủi ro, cô lập vùng tổn thương, tránh làm suy sụp tính toàn vẹn của dữ liệu cơ quan."
  },
  {
    id: 11,
    topic: "quydinh",
    text: "Theo Nghị định 13/2023/NĐ-CP, hành vi tự ý chuyển giao danh sách thông tin cá nhân của công dân diện nhận trợ cấp xã hội cho đơn vị thiện nguyện bên ngoài mà không được sự đồng ý của đối tượng dữ liệu sẽ bị xử lý như thế nào?",
    opts: [
      "A. Bị xử lý nghiêm khắc theo quy định pháp luật; nhẹ thì kỷ luật hành chính cán bộ, xử phạt hành chính cơ quan; nặng có thể truy cứu trách nhiệm hình sự về tội xâm phạm bí mật đời tư.",
      "B. Được khuyến khích vì đây là hành động nhân đạo giúp công dân nghèo tiếp cận được nhiều nguồn tài trợ.",
      "C. Không bị xử lý gì vì danh sách hộ trợ cấp là thông tin công khai bất kỳ ai cũng có quyền sở hữu.",
      "D. Chỉ bị nhắc nhở nội bộ trong buổi sinh hoạt chi bộ hằng quý của cơ quan hành chính xã."
    ],
    ans: 0,
    explanation: "Mọi việc xử lý, chuyển giao dữ liệu cá nhân bắt buộc phải có sự đồng ý của chủ thể dữ liệu (trừ một số trường hợp ngoại lệ luật định phục vụ quốc phòng, an ninh). Tự ý chuyển giao danh sách chứa thông tin cá nhân là vi phạm pháp luật pháp hành chính về bảo vệ dữ liệu."
  },
  {
    id: 12,
    topic: "quydinh",
    text: "Trong quản lý hành chính, việc phân chia tài khoản số cá nhân riêng biệt cho từng công chức (không dùng chung tài khoản tác nghiệp) mang tính chất bắt buộc nhằm mục đích gì?",
    opts: [
      "A. Đảm bảo tính xác thực đơn nhất, chống chối bỏ trách nhiệm hình sự/hành chính; mỗi thao tác chỉnh sửa dữ liệu số đều được định danh chính danh công chức chịu trách nhiệm pháp lý.",
      "B. Nhằm giúp quản trị mạng không phải phân loại quyền hạn công việc của từng người rắc rối.",
      "C. Để làm tăng doanh thu bản quyền phần mềm hỗ trợ hệ thống quản lý dữ liệu hành chính.",
      "D. Để phục vụ việc tính toán lương, phụ cấp công vụ chính xác cho từng cán bộ cấp xã."
    ],
    ans: 0,
    explanation: "Nguyên tắc định danh và không thoái thác trách nhiệm (non-repudiation) yêu cầu mỗi cán bộ phải chịu trách nhiệm hoàn toàn về các thao tác được thực hiện bằng danh tính số của mình. Dùng chung tài khoản sẽ làm triệt tiêu khả năng truy xuất trách nhiệm khi có sai phạm."
  },
  {
    id: 13,
    topic: "quydinh",
    text: "Nếu một công chức được đơn vị giao quản lý lưu trữ dữ liệu địa chính xã, họ cần nhận thức lý do vì sao phải áp dụng nguyên tắc sao lưu '3-2-1' (3 bản sao, 2 loại phương tiện, 1 bản lưu ngoài cơ sở)?",
    opts: [
      "A. Để đảm bảo tính sẵn sàng và khả năng phục hồi dữ liệu tối đa trước các rủi ro thảm họa vật lý (cháy nổ, ngập lụt), hỏng hóc phần cứng hàng loạt hoặc bị mã hóa bởi ransomware.",
      "B. Vì đây là quy chuẩn bắt buộc để tăng số lượng hồ sơ in ấn lưu trữ làm thành tích nộp báo cáo.",
      "C. Nhằm giúp các công ty cung cấp thiết bị lưu trữ ổ cứng tăng doanh số tiêu thụ sản phẩm.",
      "D. Nhằm mục đích phục vụ cho việc lưu giữ hồ sơ lịch sử lâu đời từ thời các triều đại phong kiến."
    ],
    ans: 0,
    explanation: "Quy luật 3-2-1 là tiêu chuẩn vàng trong sao lưu dữ liệu. Nó triệt tiêu rủi ro điểm hỏng hóc duy nhất (single point of failure), đảm bảo dữ liệu luôn có phương án dự phòng cô lập kể cả khi cơ quan gặp sự cố thảm họa vật lý phá hủy mọi máy móc tại chỗ."
  },
  {
    id: 14,
    topic: "quydinh",
    text: "Theo Luật An toàn thông tin mạng, khi công chức được cấp trang thiết bị làm việc cầm tay (như laptop nghiệp vụ thanh tra), việc tự ý cho người thân mượn sử dụng để học tập hoặc giải trí bị nghiêm cấm vì lý do cốt lõi nào?",
    opts: [
      "A. Người ngoài không có ý thức bảo mật có thể vô tình kích hoạt mã độc ẩn, truy cập hoặc làm lộ dữ liệu mật chứa trong máy, vi phạm nguyên tắc kiểm soát quyền sử dụng của chủ quản hệ thống.",
      "B. Sẽ làm hao mòn nhanh chóng vẻ bên ngoài thẩm mỹ của thiết bị công vụ được nhà nước cấp.",
      "C. Làm tốn dung lượng băng thông truy cập mạng ở nhà riêng do người thân tải phim hay chơi game.",
      "D. Vì người thân có thể gỡ bỏ hệ điều hành Windows bản quyền gốc để cài đặt các hệ điều hành lậu."
    ],
    ans: 0,
    explanation: "Thiết bị nghiệp vụ là phương tiện chứa thông tin hành chính nhạy cảm và được áp dụng các chính sách an toàn đặc biệt. Chuyển giao thiết bị cho cá nhân không có thẩm quyền sử dụng là vi phạm nghiêm trọng quy chế an toàn tài sản nhà nước."
  },
  {
    id: 15,
    topic: "quydinh",
    text: "Tại sao công chức văn thư khi tiếp nhận văn bản chuyển phát nhanh vật lý từ các đơn vị chưa rõ danh tính phải tuân thủ nghiêm ngặt quy trình kiểm tra phong bì và ghi sổ thay vì mở ngay lập tức không kiểm soát?",
    opts: [
      "A. Để phòng ngừa nguy cơ văn bản được tẩm hóa chất độc hại, chứa vật lạ gây cháy nổ, hoặc giả mạo con dấu cấp trên để đánh lừa quy trình phân phối tài liệu hành chính.",
      "B. Vì việc làm sổ sách rườm rà là bắt buộc để chứng minh công chức văn thư có làm việc chăm chỉ.",
      "C. Để gửi trả lại văn bản nhằm mục đích giảm tải số lượng công việc xử lý văn thư hàng ngày.",
      "D. Nhằm thu tiền lệ phí vận chuyển nộp ngân sách địa phương từ bưu điện chuyển phát."
    ],
    ans: 0,
    explanation: "Quy trình kiểm soát vật lý đối với văn bản đi/đến (theo các quy định nghiệp vụ hành chính) giúp ngăn chặn các đòn tấn công phi kỹ thuật (social engineering), tấn công vật lý độc hại xâm phạm đến an toàn tính mạng cán bộ và an ninh cơ quan."
  },
  {
    id: 16,
    topic: "quydinh",
    text: "Dưới góc độ pháp lý, Nghị định 13/2023/NĐ-CP chia 'Dữ liệu cá nhân' thành hai loại chính nào và tại sao việc phân loại này lại tối quan trọng cho công tác bảo mật của công chức?",
    opts: [
      "A. Dữ liệu cá nhân cơ bản và Dữ liệu cá nhân nhạy cảm; do dữ liệu nhạy cảm (như tài chính, sức khỏe, đời tư) khi lộ lọt sẽ trực tiếp đe dọa sự an toàn, tài sản, quyền lợi tức thì của công dân nên cần quy trình bảo vệ đặc biệt phức tạp.",
      "B. Dữ liệu cá nhân công khai và Dữ liệu cá nhân mật; giúp công chức biết dữ liệu nào được phép bán cho bên quảng cáo và dữ liệu nào cần giữ lại.",
      "C. Dữ liệu số hóa và Dữ liệu viết tay; nhằm giúp phân định công việc giữa cán bộ công nghệ và cán bộ hành chính thông thường.",
      "D. Dữ liệu trong tỉnh và Dữ liệu ngoài tỉnh; nhằm phục vụ công tác thống kê địa giới hành chính dân cư địa phương."
    ],
    ans: 0,
    explanation: "Việc phân loại dữ liệu thành cơ bản và nhạy cảm (Điều 3, Nghị định 13/2023/NĐ-CP) là kim chỉ nam để các chủ thể xử lý thiết lập các chốt chặn kiểm soát, báo cáo đánh giá tác động và áp dụng mã hóa thích ứng, ngăn ngừa tổn thương nghiêm trọng cho người dân."
  },
  {
    id: 17,
    topic: "quydinh",
    text: "Tại sao việc thực thi trách nhiệm 'bảo vệ bí mật nhà nước trên không gian mạng' là nhiệm vụ bắt buộc của từng công chức chứ không phải là điều mang tính tự nguyện lựa chọn?",
    opts: [
      "A. Vì đây là trách nhiệm pháp lý được quy định rõ trong Luật Bảo vệ bí mật nhà nước, Luật An ninh mạng; mọi hành vi lơ là để rò rỉ thông tin thuộc danh mục mật đều bị xử lý nghiêm minh trước pháp luật, kể cả truy tố hình sự.",
      "B. Nhằm giúp các công chức được cấp thêm chứng chỉ chuyên gia kỹ thuật mạng quốc tế.",
      "C. Vì khi hoàn thành tốt nhiệm vụ này, công chức sẽ nhận được tiền thưởng trực tiếp từ Quỹ phát triển hạ tầng số khu vực.",
      "D. Để cán bộ tự hào khoe thành tích bảo vệ dữ liệu với người dân trên các trang mạng xã hội công cộng."
    ],
    ans: 0,
    explanation: "Tuân thủ nội quy bảo mật thông tin và danh mục bí mật nhà nước là nghĩa vụ pháp lý tối thượng của cán bộ, công chức làm việc trong hệ thống chính trị Việt Nam, quy định rõ ràng trong Luật Cán bộ, công chức và pháp luật chuyên ngành."
  },
  {
    id: 18,
    topic: "quydinh",
    text: "Theo Luật An toàn thông tin mạng, lý do tối quan trọng nào khiến công chức KHÔNG bao giờ được tự ý cắm thiết bị lưu trữ di dộng (USB, ổ cứng di động) lạ nhặt được ngoài hành lang hoặc do ai đó gửi tặng không rõ nguồn gốc vào máy tính nghiệp vụ?",
    opts: [
      "A. Thiết bị có thể chứa mã độc được lập trình sẵn nhằm tự động kích hoạt nạp phần mềm độc hại (trojan/keylogger) ngay khi cắm vào cổng USB (tấn công BadUSB), đánh cắp toàn bộ khóa bảo mật cơ quan.",
      "B. Vì cắm USB lạ sẽ làm máy tính tiêu hao điện năng vượt mức cho phép của ngân sách cơ quan hành chính.",
      "C. USB lạ luôn bị định vị bởi vệ tinh định vị toàn cầu của nước ngoài và sẽ làm lộ vị trí phòng Một cửa.",
      "D. Thiết bị đó sẽ lấy mất dung lượng bộ nhớ RAM của hệ thống máy tính làm việc và không thể hoàn tác."
    ],
    ans: 0,
    explanation: "Phương thức tấn công BadUSB hoặc thả USB độc hại (USB drop) là kỹ thuật tấn công phi kỹ thuật kinh điển nhưng cực kỳ nguy hiểm. Mã độc có thể xâm nhập hệ thống mà không cần người dùng nhấp đúp mở bất cứ tập tin nào."
  },
  {
    id: 19,
    topic: "quydinh",
    text: "Nêu tầm quan trọng đặc biệt của việc 'Phê duyệt chủ trương, thẩm định an toàn thông tin' trước khi chính quyền xã đưa một Trang thông tin điện tử (Website) mới vào hoạt động chính thức?",
    opts: [
      "A. Đảm bảo cổng web đã được rà soát và vá toàn bộ lỗ hổng bảo mật nghiêm trọng (SQL Injection, XSS), cấu hình an toàn hệ thống, phòng ngừa khả năng trang web bị tin tặc tấn công thay đổi giao diện (deface) hoặc cài link lừa đảo tài chính.",
      "B. Để giúp website được xếp hạng cao hơn trong kết quả tìm kiếm của Google một cách tự nhiên.",
      "C. Nhằm giúp đơn vị xây dựng phần mềm được thanh toán toàn bộ hợp đồng kinh tế nhanh chóng hơn.",
      "D. Để chính thức công nhận năng lực lập trình web của các cán bộ CNTT đang công tác tại xã nghiệp vụ."
    ],
    ans: 0,
    explanation: "Website cơ quan nhà nước là bộ mặt thông tin chính thống và thường là mục tiêu tấn công hàng đầu của tin tặc. Việc kiểm tra và đánh giá an toàn thông tin định kỳ trước và trong quá trình vận hành là bắt buộc theo quy định pháp luật hiện hành."
  },
  {
    id: 20,
    topic: "quydinh",
    text: "Tại sao công chức thuộc cơ quan chính quyền địa phương nên tham gia đầy đủ các lớp tập huấn mô phỏng sự cố tấn công mạng (như diễn tập ứng phó Ransomware, Phishing) do Sở Thông tin và Truyền thông tổ chức?",
    opts: [
      "A. Giúp hình thành phản xạ thực tế, nắm rõ quy trình báo cáo và cách xử lý kỹ thuật ban đầu, khắc phục tâm lý hoảng loạn để bảo vệ hạ tầng dữ liệu của địa phương kịp thời khi xảy ra tấn công thực tế.",
      "B. Là một điều bắt buộc để cán bộ có lý do chính đáng vắng mặt tại văn phòng làm việc cơ quan.",
      "C. Giúp công chức tìm kiếm thêm cơ hội liên hệ việc chuyển công tác tới các tập đoàn bảo mật tư nhân.",
      "D. Để nhận được các chứng chỉ lập trình viên an toàn mạng cấp quốc tế từ Sở CNTT phân phối."
    ],
    ans: 0,
    explanation: "Kỹ năng lý thuyết chỉ có giá trị cao khi được rèn luyện thực hành thông qua các mô hình diễn tập thực chiến (cyber drill). Diễn tập giúp cán bộ phân định rõ vai trò, tối ưu hóa quy trình phối hợp khẩn cấp khi thảm họa mạng xảy ra."
  },
 
  // ===== CHỦ ĐỀ 2: SỬ DỤNG MÁY TÍNH – HIỂU RỦI RO & LÝ DO =====
  { id:21, topic:"maytinh", text:"Tại sao khóa màn hình (Windows+L) khi rời bàn dù chỉ 1–2 phút lại quan trọng?", opts:["A. Vì phải tuân thủ quy định cứng nhắc","B. Vì trong vài phút, người khác có thể truy cập dữ liệu, chỉnh sửa, sao chép thông tin nhạy cảm mà không cần mật khẩu","C. Để máy tính không bị mất pin","D. Vì muốn tiết kiệm điện"], ans:1 },
  { id:22, topic:"maytinh", text:"Lý do cơ bản tại sao mật khẩu cần có ít nhất 8 ký tự hỗn hợp (chữ + số + ký tự đặc biệt) là gì?", opts:["A. Vì quy định yêu cầu nên phải làm","B. Vì kẻ xấu dùng máy tính để thử đoán mật khẩu; mật khẩu dài, phức tạp tăng thời gian đoán gấp bao lần","C. Để nhân viên CNTT kiếm việc sửa mật khẩu","D. Để làm khó nhân viên sử dụng"], ans:1 },
  { id:23, topic:"maytinh", text:"Nguy cơ gì xảy ra nếu lưu mật khẩu trong file Excel hoặc giấy tờ để 'dễ nhớ'?", opts:["A. Không có nguy cơ gì vì là tài liệu riêng","B. Nếu file bị rò rỉ hoặc giấy bị ai đó tìm thấy, mật khẩu sẽ bị chiếm quyền truy cập","C. Máy tính sẽ tự động xóa mật khẩu đó","D. Chỉ nguy cơ quên mật khẩu"], ans:1 },
  { id:24, topic:"maytinh", text:"Tại sao cần cập nhật hệ điều hành, trình duyệt thường xuyên thay vì chỉ khi máy chậm?", opts:["A. Vì cập nhật làm máy nhanh hơn","B. Vì bản cập nhật chứa 'bản vá bảo mật' để khóa các lỗ hổng mà hacker có thể khai thác","C. Để thay đổi giao diện đẹp hơn","D. Vì quy định yêu cầu tăng chi phí bảo trì"], ans:1 },
  { id:25, topic:"maytinh", text:"Tại sao không nên tắt phần mềm diệt virus để 'máy chạy nhanh hơn'?", opts:["A. Vì nhà cung cấp muốn kiếm tiền từ xử lý virus","B. Vì khi tắt, máy sẽ mất lớp bảo vệ; bất kỳ file lạ hoặc website độc hại nào cũng có thể xâm nhập mà không cảnh báo","C. Vì máy sẽ tự động cài lại phần mềm diệt virus","D. Không lý do gì, chỉ là kiên nhẫn chờ"], ans:1 },
  { id:26, topic:"maytinh", text:"Nguy cơ chính của việc cài phần mềm 'crack' từ website lạ là gì?", opts:["A. Phần mềm sẽ bị lỗi, máy chạy chậm","B. File cài đặt có thể chứa mã độc, virus; một khi cài vào, tất cả tài khoản, file, hệ thống đều có thể bị đánh cắp","C. Chỉ là lãng phí dung lượng","D. Phần mềm sẽ hết hạn sử dụng"], ans:1 },
  { id:27, topic:"maytinh", text:"Tại sao khi cắm USB cá nhân vào máy tính công vụ, cần quét virus trước?", opts:["A. Vì quy định bắt buộc nên phải làm","B. Vì USB cá nhân có thể chứa virus từ máy tính cá nhân; nếu không quét mà mở file trực tiếp, virus sẽ lây sang hệ thống công vụ","C. Để kiểm tra dung lượng USB","D. Vì cần biết nếu USB còn không kém phần"], ans:1 },
  { id:28, topic:"maytinh", text:"Lý do tại sao cần sao lưu dữ liệu định kỳ lên ít nhất 2 nơi là gì?", opts:["A. Vì quy định yêu cầu cử nhân bớt việc","B. Vì nếu một bản bị hỏng, mất, hay bị mã hóa (ransomware), bạn vẫn còn bản khác để khôi phục; tránh mất toàn bộ công việc","C. Để tốn chi phí lưu trữ","D. Vì cần in ra nhiều bản"], ans:1 },
  { id:29, topic:"maytinh", text:"Tại sao phòng tiếp dân là nơi đặc biệt cần chú ý khóa màn hình máy tính?", opts:["A. Vì phòng tiếp dân nhiều máy tính hơn","B. Vì có rất nhiều người (công dân) qua lại, ai cũng có cơ hội nhìn thấy màn hình hoặc chỉnh sửa dữ liệu nếu không khóa","C. Vì máy tính ở phòng tiếp dân hay bị hỏng","D. Vì phòng tiếp dân không cần bảo mật thông tin"], ans:1 },
  { id:30, topic:"maytinh", text:"Nguy cơ nào nếu mở file đính kèm dạng .exe từ email không rõ nguồn?", opts:["A. Chỉ là lãng phí thời gian","B. File .exe là file thực thi; khi mở, nó sẽ chạy lệnh; nếu là mã độc, nó có thể cài virus, đánh cắp mật khẩu, mã hóa toàn bộ hồ sơ","C. Email sẽ bị xóa tự động","D. Chỉ cần đóng file lại là an toàn"], ans:1 },
  { id:31, topic:"maytinh", text:"Tại sao cần xin ý kiến cán bộ CNTT trước khi cài phần mềm mới?", opts:["A. Vì cán bộ CNTT muốn kiểm soát tất cả","B. Vì cần kiểm tra xem phần mềm có tương thích với hệ thống, có bản quyền hay không, hoặc có chứa mã độc không","C. Vì cài phần mềm mới không cần thiết","D. Để tăng chi phí IT"], ans:1 },
  { id:32, topic:"maytinh", text:"Mục đích của tính năng 'tự động cập nhật' (Windows Update) là gì?", opts:["A. Để máy tính tự tắt khi không dùng","B. Để tự động tải và cài các bản vá bảo mật, cải tiến hệ thống mà không cần chủ động thao tác","C. Để tốn dung lượng Internet","D. Để đổi giao diện hệ điều hành"], ans:1 },
  { id:33, topic:"maytinh", text:"Khi nhận email yêu cầu 'cập nhật thông tin tài khoản bằng cách bấm vào link', tại sao cần cảnh giác?", opts:["A. Vì email rất hữu ích","B. Vì đây là chiêu lừa phishing; kẻ xấu tạo website giả, thu thập mật khẩu khi bạn bấm link và đăng nhập","C. Vì cần bảo mật tài khoản thật","D. Vì email chứa quảng cáo"], ans:1 },
  { id:34, topic:"maytinh", text:"Tại sao không nên lưu mật khẩu vào tính năng 'Lưu mật khẩu' của trình duyệt?", opts:["A. Vì trình duyệt sẽ quên mật khẩu","B. Vì nếu trình duyệt bị tấn công hoặc máy bị chiếm quyền, kẻ xấu sẽ dễ dàng lấy tất cả mật khẩu đã lưu","C. Vì máy tính sẽ tự động đăng xuất","D. Vì làm chậm trình duyệt"], ans:1 },
  { id:35, topic:"maytinh", text:"Khi phát hiện máy tính chạy chậm bất thường, việc tự cài lại Windows mà không kiểm tra là nguy hiểm vì sao?", opts:["A. Vì cài lại Windows tốn thời gian","B. Vì nếu đó là ransomware hoặc virus tinh vi, tự cài lại có thể không loại bỏ được, hoặc mất chứng cứ để chuyên gia khắc phục","C. Vì cài lại Windows sẽ mất toàn bộ dữ liệu","D. Vì không cần thiết phải cài lại"], ans:1 },
  { id:36, topic:"maytinh", text:"Tại sao cần thực hiện quét virus định kỳ (tuần/lần) thay vì chỉ khi nghi ngờ?", opts:["A. Vì cần tốn thời gian CPU","B. Vì virus có thể hoạt động im lặng trong vài tháng mà không gây sự cố rõ ràng; quét định kỳ phát hiện sớm trước khi gây hại lớn","C. Vì diệt virus rất vui","D. Vì máy tính cần được kiểm tra như người khám bệnh"], ans:1 },
  { id:37, topic:"maytinh", text:"Lý do tại sao không nên kết nối USB lạ từ người lạ vào máy tính công vụ?", opts:["A. Vì sợ dụng lượng USB bị lấy","B. Vì USB không rõ nguồn có thể chứa virus, malware; nếu cắm vào, toàn bộ hệ thống có thể bị lây nhiễm","C. Vì USB có giá thành cao","D. Vì không ai bao giờ cần mang USB tới cơ quan"], ans:1 },
  { id:38, topic:"maytinh", text:"Ý nghĩa của nguyên tắc 'Bảo vệ thiết bị vật lý' là gì?", opts:["A. Bao quanh máy tính bằng vật liệu cứng","B. Bảo vệ máy tính, laptop, USB khỏi bị mất cắp, để lại ở nơi công cộng, hoặc được kẻ xấu có cơ hội can thiệp vật lý","C. Sơn máy tính để giữ đẹp","D. Lắp camera quanh máy tính"], ans:1 },
  { id:39, topic:"maytinh", text:"Tại sao cần đăng ký hoặc có sổ theo dõi khi mang thiết bị công vụ ra khỏi cơ quan?", opts:["A. Vì lãnh đạo muốn biết công chức ở đâu","B. Vì cần xác định trách nhiệm nếu thiết bị bị mất, hỏng, hoặc bị chiếm quyền; tránh bất cứ ai mang bất cứ thiết bị nào mà không ai biết","C. Vì công chức không được phép mang thiết bị ra ngoài","D. Để thống kê tổng số thiết bị"], ans:1 },
  { id:40, topic:"maytinh", text:"Tóm lại, tại sao 'sử dụng máy tính an toàn' là trách nhiệm của từng người chứ không chỉ cán bộ CNTT?", opts:["A. Vì cán bộ CNTT quá bận","B. Vì máy tính là công cụ hàng ngày; nếu mỗi người xử lý không an toàn, một sai sót nhỏ cũng có thể gây tê liệt toàn bộ hệ thống","C. Vì pháp luật yêu cầu phải giáo dục nhân sự","D. Vì muốn giảm chi phí bảo mật"], ans:1 },
 
  // ===== CHỦ ĐỀ 3: LỪA ĐẢO – NHẬN DIỆN & PHÒNG TRÁNH =====
  { id:41, topic:"luadao", text:"Điểm chung của tất cả hình thức lừa đảo trực tuyến là gì?", opts:["A. Chúng đều có tốn tiền","B. Chúng đều sử dụng tâm lý lừa dối, giả mạo danh tính để thu thập thông tin hoặc tiền của nạn nhân","C. Chúng đều qua điện thoại","D. Chúng đều từ nước ngoài"], ans:1 },
  { id:42, topic:"luadao", text:"Tại sao dạng lừa đảo 'giả mạo cơ quan nhà nước' lại hiệu quả?", opts:["A. Vì cơ quan nhà nước ít bảo mật thông tin","B. Vì công chức, công dân có xu hướng tin tưởng, tuân thủ yêu cầu từ cơ quan nhà nước; kẻ xấu khai thác điểm này","C. Vì bộ phận kỹ thuật không kiểm tra email","D. Vì quy định không rõ ràng"], ans:1 },
  { id:43, topic:"luadao", text:"Dấu hiệu chính để nhận diện email giả mạo từ cơ quan nhà nước là gì?", opts:["A. Email gửi từ địa chỉ @yahoo.com, @gmail.com hoặc tên miền lạ thay vì @gov.vn","B. Email có logo và tên giống thật","C. Email gửi vào giờ hành chính","D. Email viết sai chính tả"], ans:0 },
  { id:44, topic:"luadao", text:"Tại sao lừa đảo 'giả mạo người quen hoặc lãnh đạo' trên Zalo/Facebook lại nguy hiểm?", opts:["A. Vì Zalo và Facebook không an toàn","B. Vì người nhận sẽ tin tưởng ngay khi thấy ảnh đại diện, tên giống thật; không có thời gian suy nghĩ kỹ","C. Vì lãnh đạo không được phép dùng Zalo","D. Vì bất kỳ ai cũng có thể giải mã Zalo"], ans:1 },
  { id:45, topic:"luadao", text:"Khi nhận yêu cầu chuyển tiền từ tài khoản 'Chủ tịch xã', tại sao cần gọi điện xác minh thay vì tin nhắn Zalo?", opts:["A. Vì Zalo chậm hơn điện thoại","B. Vì tin nhắn Zalo có thể bị giả mạo (account giả), nhưng giọng nói trong cuộc gọi điện khó giả mạo hơn; xác minh qua giọng nói an toàn hơn","C. Vì điện thoại cổ xưa hơn Zalo","D. Vì Zalo sẽ bị hack nếu nhắn tin chuyển tiền"], ans:1 },
  { id:46, topic:"luadao", text:"Tại sao hình thức lừa đảo 'trúng thưởng' yêu cầu đóng phí trước lại hoạt động?", opts:["A. Vì quảng cáo trúng thưởng quá thực","B. Vì con người có tâm lý lạc quan, muốn may mắn; khi nghe 'trúng thưởng' sẽ bất cẩn, chỉ mong đóng phí để nhận quà mà không suy nghĩ","C. Vì quà tặng thật có giá trị cao","D. Vì cơ quan quản lý không ngăn chặn"], ans:1 },
  { id:47, topic:"luadao", text:"Tại sao khi nhân viên ngân hàng hay Công an gọi điện yêu cầu cung cấp mã OTP, cần cảnh giác?", opts:["A. Vì nhân viên thật không bao giờ gọi điện về kỹ thuật","B. Vì ngân hàng thật, Công an thật KHÔNG bao giờ hỏi mã OTP qua điện thoại; đây là chiêu lừa để khiến nạn nhân tự chuyển tiền 'kiểm tra'","C. Vì mã OTP yếu và dễ đoán","D. Vì điện thoại không an toàn"], ans:1 },
  { id:48, topic:"luadao", text:"Nguy cơ của việc bấm vào đường link rút gọn (bit.ly, tinyurl) từ email lạ là gì?", opts:["A. Đường link sẽ tải chậm","B. Đường link che giấu địa chỉ thật; khi bấm vào, có thể dẫn đến trang giả mạo hoặc tự động cài mã độc","C. Đường link sẽ hết hạn sử dụng","D. Chỉ là phương tiện tiết kiệm ký tự, không nguy hiểm"], ans:1 },
  { id:49, topic:"luadao", text:"Tại sao cần kiểm tra tên miền website bằng công cụ WHOIS trước khi tin tưởng?", opts:["A. Vì WHOIS có thể cho biết người đăng ký website","B. Vì WHOIS cho biết quốc gia, ngày đăng ký, địa chỉ server; nếu website tự xưng là cơ quan Việt Nam nhưng server ở nước ngoài, có thể là giả mạo","C. Vì WHOIS có thể xóa website không an toàn","D. Vì WHOIS là quản lý của Google"], ans:1 },
  { id:50, topic:"luadao", text:"Khi cảnh giác email lạ yêu cầu 'xác minh ngay trong 30 phút', tại sao là dấu hiệu lừa đảo?", opts:["A. Vì cơ quan nhà nước thường khẩn cấp","B. Vì áp lực thời gian ('khẩn cấp', 'hết hạn') làm con người bất cẩn, không suy nghĩ kỹ; đây là tâm lý lừa đảo điển hình","C. Vì không ai bao giờ có thời hạn đối xử","D. Vì cơ quan nhà nước hoạt động 24/7"], ans:1 },
  { id:51, topic:"luadao", text:"Tại sao không nên nhấp vào file đính kèm (.zip, .rar, .exe) từ email không rõ nguồn?", opts:["A. Vì file sẽ bị xóa tự động","B. Vì file đó có thể chứa mã độc; khi giải nén hoặc mở, virus sẽ kích hoạt và xâm nhập hệ thống","C. Vì giải nén file tốn thời gian","D. Vì email cấm đính kèm file từ nước ngoài"], ans:1 },
  { id:52, topic:"luadao", text:"Khi phát hiện bị lừa đảo, cần báo cáo cho ai ưu tiên đầu tiên?", opts:["A. Bạn bè, đồng nghiệp để kể chuyện","B. Lãnh đạo cơ quan và bộ phận kỹ thuật (nếu tài khoản bị xâm nhập); và cơ quan công an để báo cáo vụ lừa đảo","C. Cơ quan đó lần nữa để đòi lại tiền","D. Không ai, chỉ im lặng"], ans:1 },
  { id:53, topic:"luadao", text:"Tài khoản email công vụ bị xâm nhập sau khi bị phishing, tác hại có thể là gì?", opts:["A. Chỉ email bị xóa","B. Kẻ xấu có thể đọc toàn bộ email cũ, thay đổi mật khẩu, sao chép dữ liệu hành chính, giả mạo gửi email từ tài khoản đó","C. Chỉ ảnh hưởng đến tài khoản email đó","D. Máy tính sẽ tự khóa"], ans:1 },
  { id:54, topic:"luadao", text:"Tại sao bảo mật thông tin lạ từ bạn bè cũng quan trọng, không chỉ từ cơ quan?", opts:["A. Vì bạn bè ít nguy hiểm","B. Vì tài khoản bạn bè có thể bị xâm nhập, kẻ xấu giả mạo gửi tin nhắn hoặc file đính kèm để lừa đảo","C. Vì bạn bè không bao giờ gửi tin lạ","D. Vì chỉ cơ quan là nguy hiểm"], ans:1 },
  { id:55, topic:"luadao", text:"Lý do tại sao cần cập nhật kiến thức bảo mật từ Bộ TT&TT, Cục ATTT là gì?", opts:["A. Vì bây giờ có quá nhiều thông tin trên mạng","B. Vì hình thức lừa đảo ngày càng tinh vi, thay đổi liên tục; cập nhật kiến thức giúp nhận diện dạng mới của lừa đảo","C. Vì Bộ TT&TT muốn kiểm soát tất cả","D. Vì cơ quan muốn tất cả lo lắng"], ans:1 },
  { id:56, topic:"luadao", text:"Khi nhận email từ cơ quan cấp trên yêu cầu 'gửi lại mật khẩu để xác minh', tại sao cần từ chối?", opts:["A. Vì cơ quan cấp trên không cần biết mật khẩu","B. Vì cơ quan cấp trên thật KHÔNG bao giờ yêu cầu mật khẩu qua email; nếu có yêu cầu như vậy, gần chắc là email giả mạo","C. Vì mật khẩu sẽ hết hạn nếu gửi đi","D. Vì cơ quan cấp trên không xứng đáng biết"], ans:1 },
  { id:57, topic:"luadao", text:"Tại sao cần thận trọng khi mở ảnh, video được chia sẻ trên mạng xã hội từ người lạ?", opts:["A. Vì ảnh, video sẽ chiếm dung lượng điện thoại","B. Vì ảnh, video có thể chứa mã độc (steganography); khi tải xuống hoặc mở trên trình xem không an toàn, virus có thể kích hoạt","C. Vì ảnh, video mất thời gian xem","D. Vì mạng xã hội không cho phép chia sẻ ảnh"], ans:1 },
  { id:58, topic:"luadao", text:"Tác hại lâu dài của lừa đảo trực tuyến không chỉ là mất tiền mà còn gì?", opts:["A. Không có tác hại khác","B. Mất niềm tin vào kỹ thuật số, tâm lý căng thẳng, lo lắng; ảnh hưởng đến hiệu suất công việc và chất lượng cuộc sống","C. Chỉ ảnh hưởng bản thân, không ảnh hưởng công việc","D. Mất kỳ vọng vào internet"], ans:1 },
  { id:59, topic:"luadao", text:"Khi đồng nghiệp báo về một hình thức lừa đảo mới, tại sao cần chia sẻ lại cho toàn bộ cơ quan?", opts:["A. Để gây sợ hãi","B. Để nâng cao ý thức bảo mật chung; nếu mọi người biết, khả năng cả cơ quan bị lừa đảo sẽ giảm đáng kể","C. Vì muốn chứng minh được thông tin tốt","D. Để cơ quan trở thành nơi an toàn hơn"], ans:1 },
  { id:60, topic:"luadao", text:"Tóm lại, cách tốt nhất để phòng tránh lừa đảo là gì?", opts:["A. Không sử dụng máy tính hoặc internet","B. Luôn nghi ngờ, kiểm tra kỹ trước khi tin tưởng, xác minh thông tin qua kênh chính thức trước khi cung cấp thông tin nhạy cảm","C. Tin tưởng tuyệt đối không ai xấu","D. Chỉ cần giáo dục nhân viên CNTT"], ans:1 },
 
  // ===== CHỦ ĐỀ 4: TÀI KHOẢN SỐ – QUẢN LÝ AN TOÀN =====
  { id:61, topic:"taikhoan", text:"Tại sao không được dùng chung mật khẩu cho nhiều tài khoản khác nhau?", opts:["A. Vì quản lý viên muốn kiểm soát chặt chẽ","B. Vì nếu một tài khoản bị hack, tất cả các tài khoản khác cũng sẽ bị xâm nhập; rủi ro nhân lên gấp bao lần","C. Vì mật khẩu có tuổi thọ nhất định","D. Vì máy tính sẽ quên mất mật khẩu"], ans:1 },
  { id:62, topic:"taikhoan", text:"Mục đích của xác thực hai yếu tố (2FA) là gì?", opts:["A. Để tăng thời gian đăng nhập","B. Để tăng thêm một lớp bảo mật; ngay cả khi mật khẩu bị lộ, kẻ xấu vẫn cần mã OTP từ điện thoại để đăng nhập","C. Để kiểm soát tất cả thiết bị","D. Để giảm số lần đăng nhập"], ans:1 },
  { id:63, topic:"taikhoan", text:"Tại sao không nên đăng nhập tài khoản công vụ từ máy tính công cộng hay máy tính lạ?", opts:["A. Vì máy tính công cộng không có bản quyền Windows","B. Vì máy tính lạ có thể chứa phần mềm theo dõi bàn phím (keylogger); khi bạn nhập mật khẩu, thông tin sẽ bị ghi lại","C. Vì máy tính công cộng chậm","D. Vì máy tính lạ sẽ tự động đăng xuất sau 1 phút"], ans:1 },
  { id:64, topic:"taikhoan", text:"Khi phát hiện hoạt động đăng nhập bất thường (IP lạ, thời gian lạ) vào tài khoản công vụ, cần làm gì ưu tiên?", opts:["A. Tiếp tục làm việc bình thường","B. Đổi mật khẩu ngay lập tức, đăng xuất tất cả thiết bị, bật 2FA nếu có, báo cáo cho cán bộ CNTT","C. Chờ kẻ xấu tự rời khỏi","D. Xóa tài khoản và tạo tài khoản mới"], ans:1 },
  { id:65, topic:"taikhoan", text:"Tại sao lưu tài khoản công vụ ở các ứng dụng ngoài (Zalo, Facebook, Telegram) lại nguy hiểm?", opts:["A. Vì những ứng dụng này sẽ từ chối quyền đăng nhập","B. Vì những ứng dụng này là ứng dụng bên thứ ba không kiểm soát bởi cơ quan; nếu bị xâm nhập, tài khoản công vụ sẽ bị chiếm quyền","C. Vì những ứng dụng này nhanh hơn email","D. Vì không được phép dùng những ứng dụng này"], ans:1 },
  { id:66, topic:"taikhoan", text:"Tại sao cần thoát (Logout) hoàn toàn khi sử dụng tài khoản công vụ trên máy tính người khác?", opts:["A. Vì máy tính sẽ chậm hơn khi tài khoản còn đăng nhập","B. Vì nếu chỉ đóng tab, tài khoản vẫn đăng nhập; người dùng tiếp theo có thể truy cập mà không cần mật khẩu","C. Vì muốn bảo vệ máy tính người khác","D. Vì máy tính sẽ quên mật khẩu"], ans:1 },
  { id:67, topic:"taikhoan", text:"Rủi ro của việc sử dụng tài khoản cá nhân để đăng nhập vào hệ thống công vụ là gì?", opts:["A. Không có rủi ro gì vì đó là tài khoản cá nhân","B. Nếu tài khoản cá nhân bị hack, hệ thống công vụ cũng bị xâm nhập; không có sự phân tách giữa công việc và cá nhân","C. Chỉ ảnh hưởng đến tài khoản cá nhân","D. Máy tính sẽ từ chối đăng nhập"], ans:1 },
  { id:68, topic:"taikhoan", text:"Tại sao cần thay đổi mật khẩu định kỳ (3-6 tháng) thay vì chỉ khi bị hack?", opts:["A. Vì quy định yêu cầu nên phải làm","B. Vì nếu mật khẩu bị lộ mà không ai biết, kẻ xấu vẫn có thể truy cập; thay đổi định kỳ là biện pháp chủ động để ngăn chặn truy cập trái phép lâu dài","C. Vì máy tính sẽ quên mật khẩu cũ","D. Để giữ thói quen tốt"], ans:1 },
  { id:69, topic:"taikhoan", text:"Tại sao tài khoản công vụ được xem là 'chìa khóa' truy cập hệ thống dữ liệu cơ quan?", opts:["A. Vì nó là chìa khóa thật","B. Vì bất kỳ ai có tài khoản đó đều có quyền truy cập, chỉnh sửa, sao chép dữ liệu; nếu mất quyền kiểm soát tài khoản, hệ thống sẽ bị xâm nhập hoàn toàn","C. Vì máy tính gọi tài khoản là chìa khóa","D. Vì tài khoản không thể bị hack"], ans:1 },
  { id:70, topic:"taikhoan", text:"Lý do tại sao khi chuyển công tác hay nghỉ việc, tài khoản công vụ phải bị thu hồi ngay là gì?", opts:["A. Vì không cần dùng tài khoản nữa","B. Vì người cũ không còn cần quyền truy cập; để tránh họ truy cập từ xa, chiếm quyền, sửa chữa dữ liệu sau khi rời đi","C. Vì muốn đạo tạo họ bằng hành động","D. Vì tài khoản không có giá trị"], ans:1 },
  { id:71, topic:"taikhoan", text:"Khi nghi ngờ mật khẩu có thể đã bị lộ (ví dụ, từng đăng nhập trên máy không an toàn), cần làm gì?", opts:["A. Tiếp tục sử dụng bình thường","B. Đổi mật khẩu ngay lập tức, bất kể có sự cố rõ ràng hay không","C. Chờ cả tháng rồi mới đổi","D. Không cần đổi vì chỉ là nghi ngờ"], ans:1 },
  { id:72, topic:"taikhoan", text:"Tại sao mật khẩu nên gồm hỗn hợp (chữ hoa, chữ thường, số, ký tự đặc biệt) thay vì chỉ chữ hoặc chỉ số?", opts:["A. Vì máy tính yêu cầu vậy","B. Vì tăng số ký tự có thể sử dụng (từ 26 lên hơn 94 ký tự); nếu dùng brute force, số lần cần thử sẽ tăng theo cấp số nhân, gần như bất khả thi","C. Vì làm mật khẩu dễ nhớ hơn","D. Vì muốn làm khó người dùng"], ans:1 },
  { id:73, topic:"taikhoan", text:"Công cụ quản lý mật khẩu (Password Manager) có tác dụng gì?", opts:["A. Tự động đoán mật khẩu của người khác","B. Lưu trữ mật khẩu mạnh, phức tạp một cách an toàn; người dùng chỉ cần nhớ mật khẩu chính, công cụ sẽ điền tự động mật khẩu khác","C. Xóa toàn bộ mật khẩu của máy tính","D. Chia sẻ mật khẩu với đồng nghiệp"], ans:1 },
  { id:74, topic:"taikhoan", text:"Khi cấp mới tài khoản công vụ, tại sao cần thiết lập mật khẩu tạm thời buộc phải đổi ở lần đăng nhập đầu tiên?", opts:["A. Vì quản lý viên muốn kiểm soát","B. Vì người cấp mật khẩu tạm thời có thể biết nó; buộc đổi lần đầu đảm bảo chỉ người dùng biết mật khẩu cuối cùng","C. Vì mật khẩu tạm thời sẽ hết hạn","D. Vì máy tính yêu cầu vậy"], ans:1 },
  { id:75, topic:"taikhoan", text:"Tài khoản số cơ bản là gì, và tại sao cần bảo vệ nó?", opts:["A. Chỉ là một số để ghi nhớ","B. Là danh tính điện tử của bạn; nó mở ra quyền truy cập đến hệ thống, dữ liệu, tài chính; nếu bị chiếm quyền, tất cả sẽ bị ảnh hưởng","C. Là số điện thoại","D. Không cần bảo vệ"], ans:1 },
  { id:76, topic:"taikhoan", text:"Tại sao cần cảnh giác với email yêu cầu 'xác minh tài khoản bằng cách nhập mật khẩu'?", opts:["A. Vì email không bao giờ yêu cầu xác minh","B. Vì đây là hình thức phishing; các tổ chức thật KHÔNG bao giờ yêu cầu mật khẩu qua email; nếu nghi ngờ, hãy liên hệ trực tiếp qua số điện thoại chính thức","C. Vì email sẽ hết hạn","D. Vì máy tính sẽ tự động xóa email đó"], ans:1 },
  { id:77, topic:"taikhoan", text:"Khi sử dụng xác thực đa yếu tố (MFA) với điện thoại, tại sao cần bảo vệ điện thoại tốt?", opts:["A. Vì điện thoại là của cá nhân","B. Vì nếu điện thoại bị mất hoặc ai đó có quyền truy cập, họ có thể nhận mã OTP và đăng nhập tài khoản dù không biết mật khẩu","C. Vì điện thoại sẽ bị theo dõi","D. Vì điện thoại sẽ quên mã OTP"], ans:1 },
  { id:78, topic:"taikhoan", text:"Tóm lại, tài khoản số an toàn phụ thuộc vào những yếu tố nào?", opts:["A. Chỉ phụ thuộc vào mật khẩu mạnh","B. Phụ thuộc vào mật khẩu mạnh + thay đổi định kỳ + xác thực 2FA + sử dụng trên máy tin cậy + cảnh giác phishing","C. Chỉ phụ thuộc vào máy tính","D. Phụ thuộc vào lãnh đạo"], ans:1 },
  { id:79, topic:"taikhoan", text:"Khi ai đó xin mật khẩu tài khoản của bạn 'để hỗ trợ công việc', tại sao cần từ chối?", opts:["A. Vì bạn không muốn chia sẻ","B. Vì mật khẩu là tài sản riêng tư của bạn; chia sẻ mật khẩu mất trách nhiệm và không theo dõi được ai làm gì với tài khoản; nếu cần hỗ trợ, yêu cầu nhờ quản lý viên cấp quyền hạn chế","C. Vì bạn muốn kiểm soát tài khoản","D. Vì mật khẩu sẽ bị quên"], ans:1 },
  { id:80, topic:"taikhoan", text:"Tại sao cần kiểm tra địa chỉ email của người gửi thay vì chỉ nhìn tên hiển thị?", opts:["A. Vì tên hiển thị có thể dễ dàng được giả mạo thành 'Chủ tịch xã' hoặc 'Ngân hàng ABC', nhưng địa chỉ email thực sẽ tiết lộ danh tính thật của người gửi","B. Vì tên hiển thị quá quan trọng","C. Vì địa chỉ email sẽ hết hạn","D. Vì máy tính yêu cầu vậy"], ans:0 },
 
  // ===== CHỦ ĐỀ 5: DỮ LIỆU SỐ – QUẢN LÝ & CHIA SẺ AN TOÀN =====
  { id:81, topic:"dulieu", text:"Tại sao dữ liệu cá nhân của công dân (CCCD, địa chỉ, số điện thoại) được xem là 'tài sản quý giá'?", opts:["A. Vì chứa thông tin giá trị kinh tế","B. Vì nó có giá trị pháp lý; nếu lộ có thể bị lợi dụng để lừa đảo, đánh cắp danh tính, xâm phạm quyền lợi, an toàn công dân","C. Vì rất khó thu thập","D. Vì máy tính cần dữ liệu này"], ans:1 },
  { id:82, topic:"dulieu", text:"Mục đích của việc 'phân loại dữ liệu' thành mức độ bảo mật (Công khai, Nội bộ, Mật, Tuyệt mật) là gì?", opts:["A. Để làm phức tạp công tác quản lý","B. Để xác định mức độ bảo vệ cần thiết; dữ liệu công khai có thể chia sẻ tự do, còn mật mã cần mã hóa, phân quyền chặt chẽ","C. Để che giấu dữ liệu","D. Để lãnh đạo kiểm soát mọi dữ liệu"], ans:1 },
  { id:83, topic:"dulieu", text:"Tại sao không được gửi danh sách hộ nghèo, hộ trợ cấp (chứa thông tin cá nhân) qua Zalo, Facebook hoặc email cá nhân?", opts:["A. Vì những ứng dụng này chậm","B. Vì chúng không được bảo mật, dữ liệu có thể bị đọc trộm, lưu lại trên máy chủ nước ngoài, mất kiểm soát của cơ quan","C. Vì Zalo, Facebook sẽ xóa dữ liệu","D. Vì quy định cấm để hạn chế liên lạc"], ans:1 },
  { id:84, topic:"dulieu", text:"Lý do cơ bản tại sao cần sao lưu dữ liệu là gì?", opts:["A. Để tốn dung lượng lưu trữ","B. Để phòng trường hợp máy tính bị hỏng, bị mã hóa ransomware, hay mất dữ liệu; có sao lưu giúp khôi phục nhanh chóng mà không mất dữ liệu","C. Để kiểm soát tất cả dữ liệu","D. Vì quy định bắt buộc"], ans:1 },
  { id:85, topic:"dulieu", text:"Tại sao cần sao lưu dữ liệu ở ít nhất 2 nơi khác nhau thay vì chỉ 1 nơi?", opts:["A. Vì muốn lưu trữ nhiều hơn","B. Vì nếu một bản bị hỏng, mất, hoặc bị xóa, bạn vẫn còn bản khác để khôi phục; nếu sao lưu ở cùng một thiết bị, cả hai bản cũng sẽ bị mất","C. Vì máy tính yêu cầu vậy","D. Vì muốn lưu trữ toàn bộ dữ liệu"], ans:1 },
  { id:86, topic:"dulieu", text:"Mục đích của việc mã hóa dữ liệu (ví dụ, dùng WinRAR đặt mật khẩu) là gì?", opts:["A. Để làm giảm dung lượng file","B. Để ngăn những người không có mật khẩu không thể mở hoặc xem dữ liệu; nếu file bị mất, người tìm được cũng không thể đọc","C. Để tăng tốc độ nén file","D. Để thay đổi tên file"], ans:1 },
  { id:87, topic:"dulieu", text:"Khi cần gửi dữ liệu nhạy cảm cho đơn vị khác, cách nào an toàn nhất?", opts:["A. Gửi qua email cá nhân","B. Sử dụng hệ thống thư điện tử công vụ hoặc đường truyền được phê duyệt, file cần mã hóa hoặc đặt mật khẩu","C. Gửi qua Zalo để nhanh","D. Không nên gửi cho ai"], ans:1 },
  { id:88, topic:"dulieu", text:"Tại sao cần 'ẩn thông tin nhạy cảm' (như số CCCD) khi đưa ra báo cáo nếu không phục vụ mục đích công vụ?", opts:["A. Vì báo cáo sẽ quá ngắn","B. Vì tránh rò rỉ thông tin cá nhân không cần thiết; giảm rủi ro bị lợi dụng cho lừa đảo hoặc xâm phạm quyền lợi","C. Vì máy tính sẽ tự động ẩn thông tin","D. Vì quy định không cho phép in CCCD"], ans:1 },
  { id:89, topic:"dulieu", text:"Nguy cơ nào xảy ra nếu để thư mục Google Drive chứa dữ liệu công dân ở chế độ 'Bất kỳ ai có liên kết đều xem được'?", opts:["A. Chỉ là cảnh báo vô thực","B. Bất kỳ ai tìm được liên kết đều có thể xem, tải xuống, hoặc chỉnh sửa dữ liệu; nếu liên kết bị chia sẻ, dữ liệu sẽ lộ ra ngoài phạm vi kiểm soát","C. Liên kết sẽ hết hạn tự động","D. Google sẽ tự động xóa dữ liệu"], ans:1 },
  { id:90, topic:"dulieu", text:"Tại sao cần ghi nhật ký (log) truy cập dữ liệu?", opts:["A. Để tốn dung lượng máy chủ","B. Để xác định ai đã truy cập dữ liệu khi nào; nếu có sự cố, có thể phát hiện hoạt động bất thường và truy vết","C. Để giám sát nhân viên quá chặt chẽ","D. Để làm chậm hệ thống"], ans:1 },
  { id:91, topic:"dulieu", text:"Khi phát hiện dữ liệu bị rò rỉ ra ngoài (ví dụ, danh sách hộ nghèo bị đăng lên mạng), cần làm gì ưu tiên?", opts:["A. Để im lặng và chờ xem có ai nhận thấy không","B. Báo cáo ngay cho lãnh đạo, bộ phận CNTT, có thể báo Công an; cần tìm hiểu nguyên nhân để ngăn chặn tái diễn","C. Xóa tất cả dữ liệu từ máy chủ","D. Chỉ báo cho đồng nghiệp"], ans:1 },
  { id:92, topic:"dulieu", text:"Tại sao quy định 'cấm chia sẻ dữ liệu cá nhân khi chưa được phép' là quan trọng?", opts:["A. Vì dữ liệu cá nhân không quan trọng","B. Vì mỗi người có quyền quyền riêng tư; chia sẻ không được phép là vi phạm pháp luật về bảo vệ dữ liệu cá nhân","C. Vì không ai xứng đáng biết thông tin của người khác","D. Vì dữ liệu cá nhân sẽ được xóa"], ans:1 },
  { id:93, topic:"dulieu", text:"Tại sao cần khôi phục quy trình chi tiết khi xảy ra rò rỉ dữ liệu (xác định cách nào, khi nào, ai)?", opts:["A. Để tìm người chịu trách nhiệm và phạt","B. Để hiểu nguyên nhân, cách khắc phục, và đề ra biện pháp phòng tránh tương tự trong tương lai","C. Để viết báo cáo cho lãnh đạo","D. Để giảm nhẹ hậu quả"], ans:1 },
  { id:94, topic:"dulieu", text:"Dữ liệu ở mức 'Tuyệt mật' (bí mật quốc phòng, an ninh) cần được bảo vệ như thế nào?", opts:["A. Như bất kỳ dữ liệu nào khác","B. Lưu trữ trong tủ khoá, file mã hóa mạnh (AES-256), không truyền qua mạng, không sao chụp, tạm trữ trên máy tính không kết nối Internet","C. Chỉ in ra giấy rồi lưu bình thường","D. Không cần bảo vệ vì là 'tuyệt mật'"], ans:1 },
  { id:95, topic:"dulieu", text:"Khi cần gỡ bỏ dữ liệu cũ (ví dụ, hồ sơ 5 năm trước), tại sao không nên xóa bình thường mà phải 'tiêu hủy an toàn'?", opts:["A. Vì xóa bình thường sẽ tốn thời gian","B. Vì dữ liệu xóa bình thường vẫn có thể được khôi phục bằng công cụ phục hồi; tiêu hủy an toàn đảm bảo dữ liệu không thể lấy lại","C. Vì máy tính sẽ quên dữ liệu xóa","D. Vì quy định yêu cầu có biên bản"], ans:1 },
  { id:96, topic:"dulieu", text:"Mục đích của việc 'ẩn danh' hoặc 'khử định danh' dữ liệu (bỏ đi thông tin cá nhân nhạy cảm) is gì?", opts:["A. Để làm cho dữ liệu vô dụng","B. Để sử dụng dữ liệu vào các mục đích phân tích, nghiên cứu mà không lộ danh tính cá nhân; giảm rủi ro bảo vệ bí mật cá nhân","C. Để giảm dung lượng file","D. Để che giấu lỗi trong dữ liệu"], ans:1 },
  { id:97, topic:"dulieu", text:"Tại sao cơ sở dữ liệu dân cư cần được bảo vệ ở mức cao nhất?", opts:["A. Vì chứa thông tin quá nhiều","B. Vì nó chứa thông tin cơ bản của tất cả công dân (CCCD, địa chỉ, thông tin gia đình); nếu bị chiếm quyền, kẻ xấu có thể lợi dụng để lừa đảo, xâm phạm quyền lợi hàng triệu người","C. Vì máy chủ cần bảo vệ vật lý","D. Vì dữ liệu dân cư không bao giờ mất"], ans:1 },
  { id:98, topic:"dulieu", text:"Khi sử dụng lưu trữ đám mây (Cloud Storage) để sao lưu dữ liệu, cần lưu ý gì?", opts:["A. Chỉ cần tải lên, không cần quan tâm bảo mật","B. Kiểm tra xem nhà cung cấp có đảm bảo mã hóa, bảo mật, tuân thủ pháp luật Việt Nam không; và nên mã hóa dữ liệu trước khi tải lên","C. Đám mây là công nghệ nên tự động an toàn","D. Không nên dùng đám mây mà chỉ dùng ổ cứng ngoài"], ans:1 },
  { id:99, topic:"dulieu", text:"Tác hại của việc để dữ liệu cá nhân công dân lộ ra ngoài không chỉ là mất niềm tin mà còn?", opts:["A. Không có tác hại khác","B. Công dân bị lừa đảo, bị đánh cắp danh tính, quyền lợi, tài sản; ảnh hưởng đến uy tín cơ quan nhà nước và chính quyền địa phương","C. Chỉ ảnh hưởng bản thân cán bộ","D. Máy tính sẽ bị hỏng"], ans:1 },
  { id:100, topic:"dulieu", text:"Tóm lại, bảo mật dữ liệu số cơ bản là nói về việc gì?", opts:["A. Chỉ là để tuân thủ quy định","B. Để bảo vệ dữ liệu khỏi bị truy cập trái phép, sửa đổi, xóa, hoặc lộ ra; từ đó giữ an toàn, uy tín cơ quan, và quyền lợi công dân","C. Để kiểm soát tất cả dữ liệu","D. Để tôi tạo bộ phận CNTT mạnh hơn"], ans:1 }
];

const RAW_SCENARIO_DATA = [
  // ===== TÌNH HUỐNG – QUY ĐỊNH PHÁP LUẬT =====
  {
    id:101, topic:"tinhhuong", subtopic:"quydinh",
    scenario:"Chị Lan là cán bộ tư pháp xã vừa nhận được yêu cầu từ một người tự xưng là nhân viên Sở Tư pháp, đề nghị cung cấp qua điện thoại danh sách đăng ký kết hôn của xã trong 3 tháng gần nhất để 'phục vụ thống kê'. Người này nói 'gửi qua Zalo cho tiện, khỏi cần công văn'.",
    text:"Theo quy định, chị Lan cần nhận thức về điều gì trước tiên?",
    opts:[
      "A. Tính khẩn cấp của yêu cầu là điều quan trọng nhất",
      "B. Mỗi dữ liệu hành chính phải được bảo vệ ở mức cao; không nên chia sẻ qua kênh không chính thức như Zalo, cần công văn chính thức",
      "C. Zalo và email là như nhau về bảo mật",
      "D. Nhân viên Sở nói gì cũng phải tuân theo"
    ], ans:1
  },
  {
    id:102, topic:"tinhhuong", subtopic:"quydinh",
    scenario:"Anh Tuấn – cán bộ UBND phường – phát hiện đồng nghiệp cũ (đã chuyển công tác 2 tháng) vẫn có thể đăng nhập được vào phần mềm quản lý hộ tịch bằng tài khoản cũ và đang truy cập dữ liệu từ xa.",
    text:"Anh Tuấn nên nhận thức rằng tình huống này vi phạm nguyên tắc nào?",
    opts:[
      "A. Không vi phạm gì vì đồng nghiệp cũ biết cách sử dụng hệ thống",
      "B. Vi phạm nguyên tắc 'Thu hồi hoặc khóa tài khoản khi chuyển công tác'; để tài khoản cũ còn hoạt động là rủi ro an ninh",
      "C. Chỉ là lỗi kỹ thuật, không liên quan đến quy định",
      "D. Đồng nghiệp cũ có quyền truy cập suốt đời"
    ], ans:1
  },
  {
    id:103, topic:"tinhhuong", subtopic:"quydinh",
    scenario:"Trong cuộc họp, lãnh đạo yêu cầu cán bộ gửi toàn bộ hồ sơ xét duyệt hộ nghèo năm 2025 (bao gồm thông tin cá nhân: số CCCD, thu nhập, tình trạng sức khỏe) qua nhóm Zalo của phòng để thảo luận cho nhanh.",
    text:"Cán bộ cần hiểu rằng việc gửi dữ liệu này qua Zalo có ý nghĩa gì về mặt bảo mật?",
    opts:[
      "A. Nhanh gọn, tiết kiệm thời gian",
      "B. Vi phạm nguyên tắc bảo mật dữ liệu cá nhân; Zalo không được mã hóa đầu-cuối an toàn, dữ liệu có thể bị đọc trộm hoặc lưu lại ở máy chủ nước ngoài",
      "C. Zalo cũng an toàn như email công vụ",
      "D. Không cần quan tâm bảo mật nếu là công việc nhóm"
    ], ans:1
  },
  {
    id:104, topic:"tinhhuong", subtopic:"quydinh",
    scenario:"Chị Hoa nghỉ thai sản 6 tháng. Khi trở lại làm việc, chị phát hiện mật khẩu tài khoản email công vụ của mình vẫn còn nguyên từ trước khi nghỉ và đồng nghiệp đã dùng tài khoản đó để gửi vài văn bản hành chính thay chị trong thời gian nghỉ.",
    text:"Chị Hoa cần nhận thức về rủi ro gì trong tình huống này?",
    opts:[
      "A. Không có rủi ro vì đồng nghiệp có ý tốt giúp công việc",
      "B. Rủi ro về truy xuất trách nhiệm (không biết ai gửi văn bản nào), về an ninh (tài khoản không được bảo vệ), và quy trình không đúng",
      "C. Chỉ là sự phân công hợp lý",
      "D. Tài khoản công vụ có thể được dùng chung nếu cần"
    ], ans:1
  },
 
  // ===== TÌNH HUỐNG – SỬ DỤNG MÁY TÍNH AN TOÀN =====
  {
    id:105, topic:"tinhhuong", subtopic:"maytinh",
    scenario:"Anh Bình đang ngồi làm việc tại bàn tiếp dân thì có người dân cần hỗ trợ in một tờ khai. Anh đứng dậy ra bàn in để lấy giấy mà không khóa màn hình máy tính. Lúc này trên màn hình đang mở file danh sách hộ nghèo của xã.",
    text:"Anh Bình cần hiểu rằng hành động này có ý nghĩa gì?",
    opts:[
      "A. Không sao vì chỉ đi một lúc; người dân sẽ không nhìn vào màn hình",
      "B. Rủi ro cao vì bất kỳ ai qua lại có thể nhìn thấy, chụp ảnh, hoặc chỉnh sửa dữ liệu nhạy cảm; đây là lỗi bảo mật cơ bản",
      "C. Chỉ cần tắt màn hình là đủ",
      "D. Phòng tiếp dân không cần bảo mật thông tin"
    ], ans:1
  },
  {
    id:106, topic:"tinhhuong", subtopic:"maytinh",
    scenario:"Chị Nga tải một file có tên 'mau-don-hanh-chinh-moi-nhat-2025.docx.exe' từ một trang web lạ về máy tính công vụ. Sau khi mở file, máy tính bắt đầu chạy chậm bất thường và phần mềm diệt virus phát cảnh báo.",
    text:"Chị Nga nên hiểu rằng tình huống này cho thấy điều gì?",
    opts:[
      "A. Chỉ là hiện tượng tạm thời, không cần lo lắng",
      "B. File .exe từ nguồn lạ rất nguy hiểm; cảnh báo của diệt virus chỉ ra rủi ro; cần ngừng sử dụng ngay và báo cáo để chuyên gia xử lý",
      "C. Diệt virus sai lệch, có thể tắt đi",
      "D. Máy tính sẽ tự động sửa lỗi nếu chờ đủ lâu"
    ], ans:1
  },
  {
    id:107, topic:"tinhhuong", subtopic:"maytinh",
    scenario:"Anh Khoa được cấp trên yêu cầu cài phần mềm họp trực tuyến mới. Anh tìm trên mạng và thấy một trang web không chính thức cung cấp phiên bản 'crack' miễn phí của phần mềm đó, trong khi bản quyền chính thức cần phê duyệt qua CNTT mất vài ngày.",
    text:"Anh Khoa cần hiểu rằng tính chất của quyết định này là gì?",
    opts:[
      "A. Cài crack sẽ tiết kiệm chi phí cho cơ quan",
      "B. Cài crack từ trang web lạ là rủi ro; file crack có thể chứa mã độc; quy trình phê duyệt CNTT tồn tại để kiểm tra an toàn, không nên bỏ qua",
      "C. Nhanh gọn hơn là tốt nhất trong môi trường công vụ",
      "D. Phần mềm chính thức không khác gì phần mềm crack"
    ], ans:1
  },
  {
    id:108, topic:"tinhhuong", subtopic:"maytinh",
    scenario:"Mỗi sáng, cán bộ văn thư xã thường cắm USB cá nhân vào máy tính công vụ để chuyển ảnh chụp bằng điện thoại cá nhân (ảnh họp, ảnh sự kiện) sang máy tính để làm báo cáo. Cán bộ CNTT phát hiện điều này.",
    text:"Hành vi này thể hiện điều gì về an toàn thông tin?",
    opts:[
      "A. Hoàn toàn bình thường, tiện lợi trong công việc hàng ngày",
      "B. Rủi ro vì USB cá nhân có thể chứa virus từ máy tính cá nhân; nếu không quét mà cắm trực tiếp, virus sẽ lây sang hệ thống công vụ toàn cục",
      "C. Chỉ cần quét virus USB là an toàn",
      "D. Máy tính công vụ sẽ tự động cách ly USB"
    ], ans:1
  },
 
  // ===== TÌNH HUỐNG – LỪA ĐẢO TRỰC TUYẾN =====
  {
    id:109, topic:"tinhhuong", subtopic:"luadao",
    scenario:"Cán bộ địa chính xã nhận được cuộc gọi từ số lạ, người gọi tự xưng là 'Thiếu tá Công an tỉnh', nói rằng tài khoản ngân hàng của cán bộ liên quan đến đường dây rửa tiền và yêu cầu chuyển toàn bộ tiền trong tài khoản vào 'tài khoản kiểm tra của Bộ Công an' trong vòng 30 phút.",
    text:"Cán bộ cần nhận diện nguy cơ này dựa vào yếu tố nào?",
    opts:[
      "A. Công an thật sẽ gọi để đe dọa khi có nghi vấn",
      "B. Công an thật KHÔNG bao giờ gọi điện yêu cầu chuyển tiền 'kiểm tra'; áp lực thời gian, đe dọa tâm lý, yêu cầu chuyển tiền là dấu hiệu lừa đảo điển hình",
      "C. Công an sẽ gọi số lạ nên không cần xác minh",
      "D. Chỉ cần gọi lại số đó để hỏi là đủ"
    ], ans:1
  },
  {
    id:110, topic:"tinhhuong", subtopic:"luadao",
    scenario:"Cán bộ văn phòng UBND xã nhận email với tiêu đề 'KHẨN: Cập nhật dữ liệu công chức trước 17h hôm nay' từ địa chỉ sonv_quangngai@gmail.com, kèm đường link http://ubnd-quangngai.vn.xyz/dangnhap để đăng nhập xác minh tài khoản công vụ.",
    text:"Cán bộ cần phát hiện điểm lừa đảo dựa trên hiểu biết gì?",
    opts:[
      "A. Email khẩn cấp thường từ cơ quan chính thức",
      "B. Tên miền chính thức của cơ quan nhà nước Việt Nam kết thúc bằng .gov.vn, không phải @gmail.com hay .vn.xyz; nếu khác, gần chắc là giả mạo",
      "C. Chỉ cần kiểm tra tiêu đề email",
      "D. Nội dung email là điều quan trọng nhất"
    ], ans:1
  },
  {
    id:111, topic:"tinhhuong", subtopic:"luadao",
    scenario:"Chị Thủy – kế toán UBND xã – nhận tin nhắn Zalo từ tài khoản có tên hiển thị và ảnh đại diện giống hệt Chủ tịch UBND xã: 'Em ơi, anh đang họp không nghe máy được. Em chuyển gấp 8 triệu vào tài khoản 1234567890 – MB Bank cho đoàn kiểm tra nhé, chiều anh hoàn lại.'",
    text:"Chị Thủy cần nhận thức rằng điểm yếu trong nhận diện này là gì?",
    opts:[
      "A. Ảnh và tên giống hệt nên chắc chắn là thật",
      "B. Hình ảnh (ảnh đại diện, tên) có thể giả mạo; giọng nói qua điện thoại gọi trực tiếp khó giả mạo hơn; cần xác minh qua gọi điện trước khi chuyển tiền",
      "C. Zalo là ứng dụng chính thức nên tin tưởng được",
      "D. Áp lực thời gian 'gấp' là dấu hiệu hợp pháp"
    ], ans:1
  },
  {
    id:112, topic:"tinhhuong", subtopic:"luadao",
    scenario:"Anh Dũng nhận được thông báo trúng thưởng 'Chương trình tri ân khách hàng VinCommerce' qua SMS: 'Chúc mừng bạn trúng thưởng iPhone 15 Pro. Để nhận thưởng, vui lòng đóng 350.000đ phí vận chuyển vào số TK 9876543210 – Vietcombank'. Anh hỏi ý kiến đồng nghiệp.",
    text:"Đồng nghiệp của anh Dũng cần giúp anh hiểu điều gì?",
    opts:[
      "A. Đây là cơ hội tốt để nhận thưởng miễn phí",
      "B. Đây là hình thức lừa đảo chiếm đoạt tiền cọc; hợp pháp không bao giờ yêu cầu đóng phí trước để nhận thưởng nếu anh chưa đăng ký tham gia",
      "C. Phí vận chuyển là hợp lý",
      "D. Nên đóng thử một nửa tiền trước"
    ], ans:1
  },
 
  // ===== TÌNH HUỐNG – TÀI KHOẢN SỐ =====
  {
    id:113, topic:"tinhhuong", subtopic:"taikhoan",
    scenario:"Chị Mai – cán bộ UBND xã – dùng chung mật khẩu 'quangngai2024' cho tài khoản email công vụ, cổng dịch vụ công và tài khoản ngân hàng cá nhân. Một ngày, chị nhận thông báo tài khoản ngân hàng của mình bị đăng nhập từ thiết bị lạ.",
    text:"Chị Mai cần nhận thức rằng nguyên tắc nào đã bị vi phạm và tại sao?",
    opts:[
      "A. Không vi phạm gì vì mật khẩu dài 12 ký tự",
      "B. Vi phạm nguyên tắc không dùng chung mật khẩu; nếu một tài khoản bị hack, tất cả tài khoản khác cũng bị xâm nhập; nên mỗi tài khoản cần mật khẩu riêng biệt",
      "C. Chỉ cần đổi mật khẩu ngân hàng là đủ",
      "D. Mật khẩu chứa tên địa phương rất mạnh"
    ], ans:1
  },
  {
    id:114, topic:"tinhhuong", subtopic:"taikhoan",
    scenario:"Anh Hùng làm việc tại bộ phận một cửa. Trong giờ trưa, anh mang laptop công vụ ra quán cà phê, kết nối Wi-Fi công cộng và đăng nhập vào hệ thống quản lý hồ sơ hành chính để xử lý một số việc tồn đọng.",
    text:"Hành vi này thể hiện hiểu biết nào về an toàn tài khoản?",
    opts:[
      "A. Tiện lợi, nên làm khi bận",
      "B. Rủi ro cao vì Wi-Fi công cộng có thể bị nghe lén; thông tin đăng nhập có thể bị chặn bởi kẻ xấu ở cùng mạng; không nên truy cập hệ thống công vụ từ mạng công cộng",
      "C. Laptop có phần mềm diệt virus nên an toàn",
      "D. Chỉ nguy hiểm nếu không có VPN"
    ], ans:1
  },
  {
    id:115, topic:"tinhhuong", subtopic:"taikhoan",
    scenario:"Cán bộ tư pháp hộ tịch xã vừa đăng nhập tài khoản email công vụ trên máy tính của phòng CNTT huyện để kiểm tra một văn bản. Sau khi kiểm tra xong, cán bộ đóng tab trình duyệt mà không bấm 'Đăng xuất'.",
    text:"Cán bộ cần hiểu rằng điểm lỗi này có ý nghĩa gì?",
    opts:[
      "A. Không sao vì đã đóng tab",
      "B. Tài khoản vẫn còn đăng nhập trên máy đó; người dùng tiếp theo có thể truy cập email công vụ mà không cần mật khẩu; cần luôn bấm Logout trước khi rời máy lạ",
      "C. Chỉ cần xóa lịch sử trình duyệt",
      "D. Tài khoản sẽ tự động đăng xuất"
    ], ans:1
  },
  {
    id:116, topic:"tinhhuong", subtopic:"taikhoan",
    scenario:"Trong khi kiểm tra lịch sử đăng nhập email công vụ, chị Phương phát hiện có phiên đăng nhập từ IP ở Hà Nội vào lúc 2 giờ sáng trong khi chị đang ở Quảng Ngãi và chưa từng đến Hà Nội.",
    text:"Chị Phương cần nhận diện điều gì từ hiện tượng này?",
    opts:[
      "A. Có thể là lỗi hệ thống, không đáng quan tâm",
      "B. Đây là dấu hiệu bất thường; tài khoản có thể bị xâm nhập; cần đổi mật khẩu ngay, bật 2FA, đăng xuất tất cả thiết bị, và báo cáo cho CNTT",
      "C. Chỉ cần thay đổi cài đặt bảo mật",
      "D. IP Hà Nội không nguy hiểm vì là thành phố"
    ], ans:1
  },
 
  // ===== TÌNH HUỐNG – DỮ LIỆU SỐ =====
  {
    id:117, topic:"tinhhuong", subtopic:"dulieu",
    scenario:"Cán bộ văn phòng – thống kê xã cần gửi file danh sách 200 hộ dân có thông tin số CCCD, địa chỉ, thu nhập để phòng LĐTB&XH huyện xét duyệt trợ cấp. Cán bộ định gửi qua nhóm Zalo 'Công tác xã hội 2025' có 15 thành viên vì 'tiện và nhanh'.",
    text:"Cán bộ cần nhận thức rằng lựa chọn này vi phạm nguyên tắc gì?",
    opts:[
      "A. Không vi phạm vì nhóm Zalo chỉ có cán bộ",
      "B. Vi phạm nguyên tắc 'chia sẻ dữ liệu cá nhân chỉ qua kênh chính thức'; Zalo không được bảo mật, dữ liệu có thể lưu ở máy chủ nước ngoài; cần gửi qua email công vụ hoặc hệ thống nội bộ, file nên mã hóa",
      "C. Nhóm Zalo có 15 người nên an toàn",
      "D. Chỉ cần xóa số CCCD là được"
    ], ans:1
  },
  {
    id:118, topic:"tinhhuong", subtopic:"dulieu",
    scenario:"Do hỏng ổ cứng đột ngột, toàn bộ hồ sơ xử lý thủ tục hành chính của UBND xã trong 6 tháng bị mất, không có bản sao lưu nào. Lãnh đạo xã yêu cầu kiểm điểm.",
    text:"Sự cố này cho thấy nguyên tắc bảo mật nào bị bỏ qua?",
    opts:[
      "A. Không ai có trách nhiệm vì là sự cố kỹ thuật",
      "B. Nguyên tắc 'sao lưu dữ liệu định kỳ' bị bỏ qua; cần thiết lập sao lưu tự động hàng ngày/tuần lên máy chủ nội bộ hoặc hệ thống lưu trữ tập trung",
      "C. Chỉ cần mua ổ cứng mới",
      "D. Dữ liệu hành chính không cần sao lưu"
    ], ans:1
  },
  {
    id:119, topic:"tinhhuong", subtopic:"dulieu",
    scenario:"Phóng viên địa phương liên hệ UBND xã đề nghị cung cấp danh sách các hộ dân nhận hỗ trợ thiên tai năm 2024 kèm số CCCD và số tài khoản ngân hàng của từng hộ để 'đưa tin minh bạch'. Cán bộ được phân công tiếp nhận đề nghị này.",
    text:"Cán bộ cần hiểu rằng yêu cầu này liên quan đến nguyên tắc gì?",
    opts:[
      "A. Nên cung cấp để công khai thông tin hành chính",
      "B. Nguyên tắc 'bảo vệ dữ liệu cá nhân'; số CCCD, số tài khoản là dữ liệu nhạy cảm, không nên chia sẻ ngoài phạm vi công vụ cần thiết; cần từ chối hoặc chỉ cung cấp tên, địa chỉ",
      "C. Phóng viên có quyền biết tất cả thông tin công chúng",
      "D. Minh bạch thông tin có ưu tiên cao hơn bảo vệ dữ liệu cá nhân"
    ], ans:1
  },
  {
    id:120, topic:"tinhhuong", subtopic:"dulieu",
    scenario:"Khi kiểm tra hệ thống, cán bộ CNTT phát hiện một thư mục trên Google Drive của cơ quan chứa hồ sơ cán bộ (lương, thưởng, đánh giá năng lực) đang được chia sẻ ở chế độ 'Bất kỳ ai có đường link đều có thể xem và chỉnh sửa' từ 3 tháng nay.",
    text:"Sự cố này thể hiện hiểu biết nào về quản lý dữ liệu?",
    opts:[
      "A. Không nghiêm trọng vì chưa ai báo cáo bị rò rỉ",
      "B. Rất nghiêm trọng vì dữ liệu nhân sự mật đã lộ ra ngoài phạm vi kiểm soát; cần thu hồi quyền truy cập ngay, kiểm tra ai đã truy cập, mã hóa toàn bộ dữ liệu nhân sự, báo cáo lãnh đạo",
      "C. Chỉ cần đổi tên file",
      "D. Nên xóa và tạo lại từ đầu mà không báo cáo"
    ], ans:1
  }
];

const getDifficulty = (numId: number): 'easy' | 'medium' | 'hard' => {
  const relId = ((numId - 1) % 20) + 1; // 1 to 20 range
  if (relId <= 10) return 'easy';
  if (relId <= 15) return 'medium';
  return 'hard';
};

const getCategory = (topic: string): 'law' | 'computer' | 'phishing' | 'account' | 'data' => {
  switch (topic) {
    case 'quydinh': return 'law';
    case 'maytinh': return 'computer';
    case 'luadao': return 'phishing';
    case 'taikhoan': return 'account';
    case 'dulieu': return 'data';
    default: return 'law';
  }
};

const getScenarioTopicName = (subtopic: string): string => {
  switch (subtopic) {
    case 'quydinh': return 'Quy định PL';
    case 'maytinh': return 'Sử dụng máy tính';
    case 'luadao': return 'Lừa đảo TT';
    case 'taikhoan': return 'Tài khoản số';
    case 'dulieu': return 'Dữ liệu số';
    default: return 'Tình huống';
  }
};

export const DETAILED_POOL_QUESTIONS: Question[] = RAW_MCQ_DATA.map(item => {
  const choices = item.opts.map((optStr, optIdx) => {
    const optionId = String.fromCharCode(65 + optIdx);
    let cleanedText = optStr.trim();
    const prefixRegex = /^[A-D]\s*[:.)-]\s*/i;
    cleanedText = cleanedText.replace(prefixRegex, '');
    return { id: optionId, text: cleanedText };
  });

  const correctAnswerId = String.fromCharCode(65 + item.ans);

  return {
    id: `q_law_${item.id}`,
    category: getCategory(item.topic),
    difficulty: getDifficulty(item.id),
    questionText: item.text,
    choices,
    correctAnswerId,
    explanation: (item as any).explanation || `Câu hỏi chủ đề ${getScenarioTopicName(item.topic)}: Đúng theo đáp án quy chế chuyên môn.`
  };
});

export const DETAILED_POOL_SCENARIOS: ScenarioQuestion[] = RAW_SCENARIO_DATA.map(item => {
  const choices = item.opts.map((optStr, optIdx) => {
    const optionId = String.fromCharCode(65 + optIdx);
    let cleanedText = optStr.trim();
    const prefixRegex = /^[A-D]\s*[:.)-]\s*/i;
    cleanedText = cleanedText.replace(prefixRegex, '');
    return { id: optionId, text: cleanedText };
  });

  const correctLetter = String.fromCharCode(65 + item.ans);

  return {
    id: `sc_${item.id}`,
    topic: getScenarioTopicName(item.subtopic),
    scenarioText: item.scenario,
    step1: {
      prompt: "Bước 1: Xác định nguy cơ an toàn hoặc nội dung bối cảnh sự việc?",
      choices: [
        { id: "A", text: "Sự cố có nguy cơ gieo rắc mã độc, lộ lọt dữ liệu hành chính hoặc vi phạm quy chế làm việc." },
        { id: "B", text: "Sự việc thông thường không có rủi ro về mặt an toàn thông tin." }
      ],
      correctAnswerId: "A"
    },
    step2: {
      prompt: "Bước 2: " + item.text,
      choices,
      correctAnswerId: correctLetter
    },
    step3: {
      prompt: "Bước 3: Lập luận an toàn thông tin cốt lõi cần nhớ là gì?",
      choices: [
        { id: "A", text: "Tuân thủ giải pháp bảo mật đúng quy trình giúp ngăn chặn tối đa nguy cơ lọt thông tin nhạy cảm của cơ quan." },
        { id: "B", text: "Giải quyết nhanh gọn các thủ tục hành chính để đảm bảo chỉ số hài lòng của người dân." }
      ],
      correctAnswerId: "A"
    },
    explanation: "Đảm bảo tính tuân thủ quy trình hành chính và bảo vệ tài nguyên số quốc gia."
  };
});
