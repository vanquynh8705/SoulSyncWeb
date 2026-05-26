export interface ExploreTipGroup {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  tips: string[];
  whyItHelps: string;
  smallAction: string;
}

export const exploreTips: ExploreTipGroup[] = [
  {
    id: "exercise",
    title: "Tập thể dục thường xuyên",
    shortDescription: "Vận động cơ thể vừa sức giúp kích hoạt hormone hạnh phúc, giải tỏa căng thẳng học tập hiệu quả.",
    iconName: "Activity",
    tips: [
      "Dành khoảng 30 phút mỗi ngày cho hoạt động thể chất, lý tưởng nhất là duy trì 3-4 lần mỗi tuần.",
      "Lựa chọn một môn thể thao hoặc hình thức vận động mà bạn thực sự hứng thú và thấy thoải mái.",
      "Rủ thêm bạn bè, bạn cùng phòng hoặc tham gia các câu lạc bộ thể thao để cùng tạo động lực tập luyện."
    ],
    whyItHelps: "Tập luyện giúp cơ thể giải phóng endorphin chất miễn dịch tự nhiên, đồng thời giảm lượng cortisol (hormon gây căng thẳng), đem lại tinh thần sảng khoái và tỉnh táo hơn.",
    smallAction: "Hôm nay, hãy đứng dậy vươn vai hoặc đi bộ nhẹ nhàng xung quanh khu vực bạn ở trong 10-15 phút xem sao nhé!"
  },
  {
    id: "sleep",
    title: "Ngủ đủ giấc",
    shortDescription: "Tái tạo năng lượng cho não bộ và cơ thể sau những giờ làm việc, học tập vất vả.",
    iconName: "Moon",
    tips: [
      "Cố gắng ngủ từ 7-8 tiếng mỗi đêm và duy trì lịch trình ngủ điều độ.",
      "Tắt điện thoại, laptop và màn hình TV ít nhất 30 phút trước khi bắt đầu chìm vào giấc ngủ.",
      "Giữ cho không gian phòng ngủ tối, yên tĩnh, thông thoáng và có nhiệt độ mát mẻ phù hợp.",
      "Thiết lập thói quen đi ngủ và thức dậy vào cùng một thời điểm tương đối cố định hàng ngày."
    ],
    whyItHelps: "Giấc ngủ chất lượng giúp làm sạch các chất thải chuyển hóa trong não bộ, củng cố trí nhớ dài hạn và đưa trạng thái tinh thần của bạn về điểm cân bằng tối ưu.",
    smallAction: "Bật chế độ không làm phiền trên điện thoại lúc 10h30 tối nay và dành 15 phút hít thở sâu trước khi nhắm mắt."
  },
  {
    id: "nutrition",
    title: "Ăn uống lành mạnh",
    shortDescription: "Cung cấp nguồn nhiên liệu dinh dưỡng đúng cách để cơ thể dẻo dai và tâm trạng điều hòa hơn.",
    iconName: "Utensils",
    tips: [
      "Hạn chế các đồ ăn thức uống chứa nhiều đường hóa học, thay thế bằng các loại hoa quả tươi chín mọng ngon lành.",
      "Tăng cường bổ sung rau xanh vào khẩu phần ăn hàng ngày, đặc biệt là các loại rau màu xanh đậm.",
      "Chú ý uống đủ nước (từ 1.5 - 2 lít nước lọc) trải đều suốt cả ngày dài.",
      "Thêm nguồn axit béo Omega-3 tự nhiên từ các loại cá lành mạnh, các hạt dinh dưỡng hoặc dầu hạt ép lạnh tốt cho trí óc."
    ],
    whyItHelps: "Dinh dưỡng cân bằng kiểm soát tốt lượng đường huyết và hệ vi sinh đường ruột (vốn liên kết chặt chẽ tới tâm trạng), giúp bạn tránh các cơn cáu gắt và uể oải vô cớ.",
    smallAction: "Thay vì mua trà sữa hay nước ngọt chiều nay, hãy chuẩn bị cho mình một ly nước lọc mát lạnh và một quả táo giòn nhé!"
  },
  {
    id: "social",
    title: "Kết nối xã hội",
    shortDescription: "Chia sẻ tâm tư, tìm kiếm điểm chung để vơi bớt cảm giác cô đơn và tăng sự kết nối sẻ chia.",
    iconName: "Users",
    tips: [
      "Sắp xếp thời gian gặp gỡ hoặc đi cà phê trò chuyện trực tiếp với bạn bè thân mến khoảng 1-2 lần mỗi tuần.",
      "Tham gia các nhóm thảo luận, câu lạc bộ sở thích hoặc hoạt động cộng đồng lành mạnh cùng trường.",
      "Dành thời gian gọi điện trò chuyện chân tình, gần gũi với người thân trong gia đình.",
      "Tập trung lắng nghe tích cực và chủ động trao gửi sự trợ giúp nhỏ đến những người xung quanh bạn."
    ],
    whyItHelps: "Sự hiện diện nâng đỡ của các mối quan hệ xã hội lành mạnh kích thích cơ thể sản sinh oxytocin, mang lại cảm giác an toàn, được yêu thương và xua tan những suy nghĩ tiêu cực đơn độc.",
    smallAction: "Gửi một tin nhắn hỏi thăm ngắn đến một người bạn cũ hoặc một người thân yêu mà đã lâu bạn chưa nói chuyện."
  }
];
